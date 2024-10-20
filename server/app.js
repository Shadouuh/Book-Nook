// Se importan los módulos
const express = require('express');
const path = require('path');
const cors = require('cors');
const anju = require('anju-js');
const { use } = require('framer-motion/client');

//Se crea la app
const app = express();
const port = 3000;

// Conexión
const createConnection = require(path.join(__dirname, 'config', 'conexBD'));

let conex;

async function init() {
    conex = await createConnection();
}

init();

// Middlewares
app.use(express.json());
app.use(cors());

// Manejo de errores
const handleError = (res, message, err = null, status = 500) => {
    console.error(message, err);
    res.status(status).send({ message });
};


/*### Endpoints ###*/


//-> Login y register <-

//Login
app.post('/login', async (req, res) => {
    try {
        const { user } = req.body;
        const clave = anju.encrypt(user.clave);

        let resultAlias;

        const [result] = await conex.execute(
            'SELECT id_login FROM login WHERE email = ? OR telefono = ?',
            [user.key, user.key]
        );

        if (result.length == 0) {
            [resultAlias] = await conex.execute('SELECT id_login FROM usuarios WHERE alias = ?', [user.key]);
            if (resultAlias.length == 0) return handleError(res, 'no se encotro la cuenta', null, 404);
        }

        const [login] = await conex.execute(
            'SELECT id_login, tipo FROM login WHERE (email = ? OR telefono = ? OR id_login = ?) AND clave=?',
            [user.key, user.key, resultAlias[0].id_login, clave]
        );

        if (login.length == 0) return handleError(res, 'Credenciales incorrectas', null, 400);

        res.send({ resultado: login });
    } catch (err) {
        return handleError(res, 'Error en el login', err);
    }
});

//Register
app.post('/register', async (req, res) => {
    const { user } = req.body;
    const clave = anju.encrypt(user.clave);

    try {
        const [emailResult] = await conex.execute('SELECT id_login FROM login WHERE email=?', [user.email]);
        if (emailResult.length > 0) return handleError(res, `El email: ${user.email} ya tiene una cuenta registrada`, null, 409);

        const [telefonoResult] = await conex.execute('SELECT telefono FROM login WHERE telefono=?', [user.telefono]);
        if (telefonoResult.length > 0) return handleError(res, `El teléfono: ${user.telefono} ya está registrado`, null, 409);

        const [loginResult] = await conex.execute(
            "INSERT INTO login(email, telefono, clave, tipo) VALUES(?, ?, ?, 'cliente')",
            [user.email, user.telefono, clave]
        );

        if (loginResult.affectedRows == 0) return handleError(res, 'Error al insertar en login');

        const [alias] = await conex.execute('SELECT alias FROM usuarios WHERE alias = ?', [user.alias]);
        if (alias.length > 0) {
            await conex.execute(
                'DELETE FROM login WHERE id_login = ?',
                [loginResult.insertId]
            )
            return handleError(res, `El alias ${user.alias} ya esta registrado`, null, 409)
        };

        const [userResult] = await conex.execute(
            'INSERT INTO usuarios(nombre, apellido, direccion, fecha_nacimiento, alias, id_login) VALUES(?, ?, ?, ?, ?, ?)',
            [user.nombre, user.apellido, user.direccion, user.fecha_nacimiento, user.alias, loginResult.insertId]
        );

        if (userResult.affectedRows == 0) return handleError(res, 'Error al insertar en usuarios');

        await conex.execute('INSERT INTO carrito(id_usuario, es_actual) VALUES(?, true)', [userResult.insertId]);

        res.status(201).send({ message: 'Se registró correctamente el usuario' });
    } catch (err) {
        return handleError(res, 'Error al registrar el usuario', err);
    }
});

//-> Cart <-

//Insert into cart
app.post('/carrito/insertar', async (req, res) => {
    const { cart } = req.body;

    try {
        const [resultCart] = await conex.execute(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? ORDER BY id_carrito DESC',
            [cart.id_usuario]
        )

        if (resultCart.length == 0) handleError(res, 'Error al obtener el id_carrito', null, 404);

        await conex.execute(
            'INSERT INTO carrito_items(cantidad, id_carrito, id_libro) VALUES(?, ?, ?)',
            [cart.cantidad, resultCart[0].id_carrito, cart.id_libro]
        );

        res.status(201).send({ message: 'Se guardo el item en el carrito' });

    } catch (err) {
        handleError(res, 'Error al guardar en el carrito', err);
    }
});





//FALTAN LOS NOMBRES DEL AUTOR Y EDITORIAL Y LAS IMAGENES





//Show items
app.get('/carrito/ver/:id', async (req, res) => {
    const { id } = req.params;
    let resultBooks = [];

    try {
        const [resultCart] = await conex.execute(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? AND es_actual = 1',
            [id]
        )

        const [resultItems] = await conex.execute(
            'SELECT id_libro FROM carrito_items WHERE id_carrito = ?',
            [resultCart[0].id_carrito]
        );

        for (const item of resultItems) {
            const book = await fetch(`http://localhost:3000/libros/ver/${item.id_libro}`);

            resultBooks.push(await book.json());
        }

        res.status(200).send({ resultBooks });

    } catch (err) {
        handleError(res, 'Hubo un error al mostrar los items del carrito', err);
    }
});

//buy
app.post('/carrito/pedir', async (req, res) => {
    const { order } = req.body;

    try {
        const [id_usuario] = await conex.execute(
            'SELECT id_usuario FROM usuarios WHERE id_usuario = ?',
            [order.id_usuario]
        );

        if (id_usuario.length == 0) handleError(res, 'No se encontro al usuario', null, 404);

        const [id_carrito] = await conex.execute(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? AND es_actual = true',
            [order.id_usuario]
        );

        if (id_carrito.length == 0) handleError(res, 'No se encontro el carrito', null, 404);

        await conex.execute(
            'INSERT INTO pedidos(total, estado, fecha_estimada, id_usuario, id_carrito) VALUES(?, "pendiente", ?, ?,?)',
            [order.total, order.fecha_estimada, order.id_usuario, id_carrito[0].id_carrito]
        );

        await conex.execute(
            'INSERT INTO carrito(id_usuario, es_actual) VALUES(?, true)',
            [order.id_usuario]
        );

        await conex.execute(
            'UPDATE carrito SET es_actual = false WHERE id_carrito = ?',
            [id_carrito[0].id_carrito]
        );

        res.status(201).send({ message: 'Se pidio el carrito' });

    } catch (err) {
        handleError(res, 'Hubo un error en el carrito', err);
    }
});

//-> Saves <-

// Save book
app.post('/api/libros/guardar', async (req, res) => {
    const { save } = req.body;
    const verifi = `SELECT id_ul FROM usuario_libro WHERE id_libro = ? AND id_usuario = ?`;

    try {
        const [result] = await conex.execute(verifi, [save.id_libro, save.id_usuario]);

        if (result.length > 0) return res.status(409).send({ message: 'El libro ya está guardado' });

        const query = `INSERT INTO usuario_libro(id_libro, id_usuario) VALUES(?, ?)`;
        await conex.execute(query, [save.id_libro, save.id_usuario]);

        res.status(201).send({ message: 'Se guardó el libro' });
    } catch (err) {
        handleError(res, 'Error al guardar el libro', err);
    }
});

// Save author
app.post('/api/autores/guardar', async (req, res) => {
    const { save } = req.body;
    const verifi = 'SELECT id_au FROM usuario_autor WHERE id_autor = ? AND id_usuario = ?';

    try {
        const [result] = await conex.execute(verifi, [save.id_autor, save.id_usuario]);

        if (result.length > 0) return res.status(409).send({ message: 'El autor ya está guardado' });

        const query = 'INSERT INTO usuario_autor(id_autor, id_usuario) VALUES(?, ?)';
        await conex.execute(query, [save.id_autor, save.id_usuario]);

        res.status(201).send({ message: 'Se guardó el autor como favorito' });
    } catch (err) {
        handleError(res, 'Error al guardar el autor favorito', err);
    }
});

// Save category
app.post('/api/categorias/guardar', async (req, res) => {
    const { save } = req.body;
    const verifi = 'SELECT id_uc FROM usuario_categoria WHERE id_categoria = ? AND id_usuario = ?';

    try {
        const [result] = await conex.execute(verifi, [save.id_categoria, save.id_usuario]);

        if (result.length > 0) return res.status(409).send({ message: 'La categoría ya está guardada' });

        const query = `INSERT INTO usuario_categoria(id_categoria, id_usuario) VALUES(?, ?)`;
        await conex.execute(query, [save.id_categoria, save.id_usuario]);

        res.status(201).send({ message: 'Se guardó la categoría como favorita' });
    } catch (err) {
        handleError(res, 'Error al guardar la categoría favorita', err);
    }
});

//-> Select, show & DESC <-

//Show books
app.get('/libros/ver/:id', async (req, res) => {
    const {id} = req.params;
    let resultBooks = [];

    try {
        
        let [books] = await conex.query(`SELECT * FROM libros WHERE id_libro = ${id}`);

        if (books.length > 0) {
            for (const book of books) {
                const [autor] = await conex.query(`SELECT nombre, apellido FROM autores WHERE id_autor = ${book.id_autor}`);
                const [editorial] = await conex.query(`SELECT nombre FROM editoriales WHERE id_editorial = ${book.id_editorial}`);
                const [imagenes] = await conex.query(`SELECT archivo, tipo_angulo FROM libro_imgs WHERE id_libro = ${book.id_libro}`);

                book.editorial = editorial.length > 0 ? editorial[0].nombre : null;
                book.autor = autor.length > 0 ? autor[0] : null;
                book.imagenes = imagenes.length > 0 ? imagenes[0] : null;

                resultBooks.push(book);
            }
        } else {
            return handleError(res, 'No hay libros', null, 404);
        }
        
        res.status(200).send({ book: resultBooks });

    } catch (err) {
        handleError(res, 'Error al mostrar los libros', err);
    }
});



// Select by id
app.get('/api/:tabla/:id', async (req, res) => {
    const { tabla, id } = req.params;

    try {
        const [result] = await conex.execute('DESC ' + tabla);
        const primaryKey = result.find(col => col.Key === 'PRI').Field;

        const [results] = await conex.execute(`SELECT * FROM ${tabla} WHERE ${primaryKey} = ?`, [id]);

        if (results.length === 0) return res.status(404).send({ message: 'No se encontró el elemento' });

        res.send({ resultados: results });
    } catch (err) {
        handleError(res, 'Error en la consulta', err);
    }
});

// DESC table
app.get('/:tabla/desc', async (req, res) => {
    const { tabla } = req.params;

    try {
        const [result] = await conex.execute('DESC ' + tabla);
        if (result.length === 0) return res.status(404).send({ message: 'No se encontró la tabla ' + tabla });

        res.status(200).send({ resultado: result });
    } catch (err) {
        handleError(res, 'Error al obtener las columnas de la tabla ' + tabla, err);
    }
});

// -> CRUD <-

//Select table
app.get('/api/:tabla', async (req, res) => {
    const { tabla } = req.params;

    try {
        const [results] = await conex.execute('SELECT * FROM ' + tabla);
        res.send({ resultados: results });
    } catch (err) {
        handleError(res, 'Error en la consulta', err);
    }
});

//Insert into table
app.post('/api/:tabla', async (req, res) => {
    const { tabla } = req.params;
    const { dates } = req.body;

    try {
        const [columns] = await conex.execute('DESC ' + tabla);
        const columnFields = columns.map(col => col.Field);
        const columnValues = columnFields.map(col => dates[col]);

        const query = `INSERT INTO ${tabla} (${columnFields.join(', ')}) VALUES (${columnFields.map(() => '?').join(', ')})`;
        await conex.execute(query, columnValues);

        res.status(201).send({ message: 'Se insertó correctamente en ' + tabla });
    } catch (err) {
        handleError(res, 'Error al insertar los datos', err);
    }
});

//Update by id
app.put('/api/:tabla/:id', async (req, res) => {
    const { tabla, id } = req.params;
    const { dates } = req.body;

    try {
        const [columns] = await conex.execute('DESC ' + tabla);
        const primaryKey = columns.find(col => col.Key === 'PRI').Field;
        const columnFields = columns.map(col => col.Field).slice(1);
        const columnValues = columnFields.map(col => dates[col]);

        const query = `UPDATE ${tabla} SET ${columnFields.join(' = ?, ')} = ? WHERE ${primaryKey} = ?`;
        await conex.execute(query, [...columnValues, id]);

        res.status(201).send({ message: `Elemento con el ${primaryKey} ${id} actualizado` });
    } catch (err) {
        handleError(res, 'Error al actualizar el elemento', err);
    }
});

//Delete by id
app.delete('/api/:tabla/:id', async (req, res) => {
    const { tabla, id } = req.params;

    try {
        const [columns] = await conex.execute('DESC ' + tabla);
        const primaryKey = columns.find(col => col.Key === 'PRI').Field;

        const query = `DELETE FROM ${tabla} WHERE ${primaryKey} = ?`;
        const [results] = await conex.execute(query, [id]);

        if (results.affectedRows === 0) return res.status(404).send({ message: 'Elemento no encontrado' });

        res.send({ message: `Elemento con el ${primaryKey} ${id} eliminado` });
    } catch (err) {
        handleError(res, 'Error al eliminar el elemento', err);
    }
});

app.listen(port, () => console.log(`Server escuchando en el puerto ${port}!`));