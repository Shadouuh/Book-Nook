// Se importan los módulos
const express = require('express');
const path = require('path');
const cors = require('cors');
const anju = require('anju-js');

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

//Manejo de errores
const handleError = (res, message, err = null, status = 500) => {
    console.error(message, err);
    res.status(status).send({ message });
};

//Promesas y funcion de verificacion

/*### Endpoints ###*/


//Login
app.post('/login', async (req, res) => {
    try {
        const { user } = req.body;
        const clave = anju.encrypt(user.clave);

        const email = user.email || null;
        const telefono = user.telefono || null;

        const [result] = await conex.execute(
            'SELECT id_login FROM login WHERE email=? OR telefono=?',
            [email, telefono]
        );

        if (result.length == 0) return res.status(400).send({ message: 'El email y telefono no estan asociados a ninguna cuenta' });

        const [login] = await conex.execute(
            'SELECT id_login, tipo FROM login WHERE (email=? OR telefono=?) AND clave=?',
            [email, telefono, clave]
        );

        if (login.length == 0) return res.status(400).send({ message: 'Credenciales incorrectas' });

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

        if (emailResult.length > 0) return res.status(409).send({ message: `El email: ${user.email} ya tiene una cuenta registrada` });

        const [telefonoResult] = await conex.execute('SELECT telefono FROM login WHERE telefono=?', [user.telefono]);

        if (telefonoResult.length > 0) return res.status(409).send({ message: `El teléfono: ${user.telefono} ya está registrado` });

        const [insertLoginResult] = await conex.execute(
            "INSERT INTO login(email, telefono, clave, tipo) VALUES(?, ?, ?, 'cliente')",
            [user.email, user.telefono, clave]
        );

        let hoy = new Date().toLocaleDateString();

        await conex.execute(
            "INSERT INTO usuarios(nombre, apellido, direccion, fecha_registro, fecha_nacimiento, alias, id_login) VALUES(?, ?, ?, ?, ?, ?, ?)",
            [user.nombre, user.apellido, user.direccion, hoy, user.fecha_nacimiento, user.alias, insertLoginResult.insertId]
        );

        res.status(201).send({ message: 'Se registró correctamente el usuario' });
    } catch (err) {
        return handleError(res, 'Error al registrar el usuario', err);
    }
});

// Toggle fav book
app.post('/api/libros/cambiarFavorito', async (req, res) => {
    const { save } = req.body;
    const verifi = 'SELECT es_favorito FROM usuario_libro WHERE id_libro = ? AND id_usuario = ?';

    try {
        const [result] = await conex.execute(verifi, [save.id_libro, save.id_usuario]);

        let query;
        if (result.length === 0) {
            query = 'INSERT INTO usuario_libro(es_favorito, id_libro, id_usuario) VALUES(1, ?, ?)';
            await conex.execute(query, [save.id_libro, save.id_usuario]);
            return res.status(201).send({ message: 'Se insertó el libro como favorito' });
        }

        query = 'UPDATE usuario_libro SET es_favorito = ? WHERE id_libro = ? AND id_usuario = ?';
        await conex.execute(query, [!result[0].es_favorito, save.id_libro, save.id_usuario]);

        res.status(200).send({ message: 'Se actualizó el estado de favorito del libro' });
    } catch (err) {
        handleError(res, 'Error al cambiar el estado de favorito del libro', err);
    }
});

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

// CRUD 
app.get('/api/:tabla', async (req, res) => {
    const { tabla } = req.params;

    try {
        const [results] = await conex.execute('SELECT * FROM ' + tabla);
        res.send({ resultados: results });
    } catch (err) {
        handleError(res, 'Error en la consulta', err);
    }
});

// Insert into table
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

// Update by id
app.put('/api/:tabla/:id', async (req, res) => {
    const { tabla, id } = req.params;
    const { dates } = req.body;

    try {
        const [columns] = await conex.execute('DESC ' + tabla);
        const primaryKey = columns.find(col => col.Key === 'PRI').Field;
        const columnFields = columns.map(col => col.Field).slice(1);  // Remove primary key
        const columnValues = columnFields.map(col => dates[col]);

        const query = `UPDATE ${tabla} SET ${columnFields.join(' = ?, ')} = ? WHERE ${primaryKey} = ?`;
        await conex.execute(query, [...columnValues, id]);

        res.status(201).send({ message: `Elemento con el ${primaryKey} ${id} actualizado` });
    } catch (err) {
        handleError(res, 'Error al actualizar el elemento', err);
    }
});

// Delete by id
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