// Se importan los módulos
const express = require('express');
const path = require('path');
const cors = require('cors');
const anju = require('anju-js');

const app = express();
const port = 3000;

// Conexión
const conex = require(path.join(__dirname, 'config', 'conexBD'));

// Middlewares
app.use(express.json());
app.use(cors());


/*### Endpoints ###*/

//LOGIN
app.post('/login', (req, res) => {
    const { user } = req.body;
    const clave = anju.encrypt(user.clave);
    const query = "SELECT id_login, tipo FROM login WHERE email=? OR telefono=? AND clave=?";

    conex.query(query, [user.email, user.telefono, clave], (err, results) => {
        if (err) {
            res.status(401).send({ message: 'Error en el login' });
        } else if (results == "") {
            res.send({ message: 'Credenciales incorrectas' });
        }
        else {
            res.send({ resultado: results });
            console.log('Se logeo correctamente');
        };
    });
});

//Register
app.post('/register', (req, res) => {
    const { user } = req.body;
    const clave = anju.encrypt(user.clave);

    const query = "INSERT INTO login(email, telefono, clave, tipo) VALUES(?, ?, ?, 'cliente')";

    conex.query(query, [user.email, user.telefono, clave], (err, results) => {
        if (err) {
            res.status(401).send({ message: 'Credenciales incorrectas' });
        } else res.send({ message: 'Se registro correctamente' });
    });
});

//Save book
app.post('/api/libros/guardar', (req, res) => {
    const { save } = req.body;

    const query = `INSERT INTO usuario_libro(estado_lectura, es_favorito, id_libro, id_usuario) VALUES('', '', '${save.id_libro}', '${save.id_usuario}')`;

    conex.query(query, (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar libro' });
        } else res.status(201).send({ message: 'Se guardo libro correctamente' });
    });
});

//Save autor
app.post('/api/autores/guardar', (req, res) => {
    const { save } = req.body;

    const query = `INSERT INTO autores(id_autor, id_usuario) VALUES('${save.id_autor}', '${save.id_usuario}')`;

    conex.query(query, (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar autor favorito' });
        } else res.status(201).send({ message: 'Se guardo el autor como favorito' });
    });
});




// !!!!!!!! JUAN DEBES COMPROBAR QUE LAS COSAS NO ESTEN GUARDAS DE ANTE MANO




//Save category
app.post('/api/categorias/guardar', (req, res) => {
    const { save } = req.body;
    const verifi = `SELECT id_uc FROM usuario_categoria WHERE id_categoria = '${save.id_categoria}' AND  id_usuario = '${save.id_usuario}'`;

    conex.query(verifi, (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Error en la consulta de verificación' });
        } else if (result.affectedRows != 0) {
            res.status(500).send({ message: 'La categoria ya esta guardada' });
        } else {
            const query = `INSERT INTO usuario_categoria(id_categoria, id_usuario) VALUES('${save.id_categoria}', '${save.id_usuario}')`;

            conex.query(query, (err, results) => {
                if (err) {
                    res.status(500).send({ message: 'Error al guardar categoria favorita' });
                } else res.status(201).send({ message: 'Se guardo la categoria como favorita' });
            });
        }
    });
});

//Select by id
app.get('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {

        if (err) return res.status(500).send({ message: 'Error al obtener las columnas de la tabla ' + tabla });

        const columnas = result.map(col => col.Field);

        result.map(function (col) {
            if (col.Key == 'PRI') primary = col.Field;
        });

        const query = `SELECT * FROM ${tabla} WHERE ${primary} = ${id}`;

        conex.query(query, (err, results) => {
            if (err) {
                res.status(500).send({ message: 'Error en la consulta' });
            } else res.send({ resultados: results });
        });
    });
});

//CRUD
app.get('/api/:tabla', (req, res) => {
    const { tabla } = req.params;
    const query = 'SELECT * FROM ' + tabla;

    conex.query(query, (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error en la consulta' });
        } else res.send({ resultados: results });
    });
});

app.post('/api/:tabla', (req, res) => {
    const { tabla } = req.params;
    const { dates } = req.body;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error al obtener las columnas de la tabla ' + tabla });

        const columnas = result.map(col => col.Field);
        const valores = columnas.map(col => dates[col]);

        const query = `INSERT INTO ${tabla} (${columnas.join(', ')}) VALUES (${columnas.map(() => '?').join(', ')})`;

        conex.query(query, valores, (err, result) => {
            if (err) return res.status(500).send({ message: 'Error al insertar los datos' });
            res.status(201).send({ message: 'Se inserto correctamente en ' + tabla });
        });
    });
});

app.put('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;
    const { dates } = req.body;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error al obtener las columnas de la tabla ' + tabla });

        const columnas = result.map(col => col.Field);
        const valores = columnas.map(col => dates[col]);

        result.map(function (col) {
            if (col.Key == "PRI") primary = col.Field;
        });

        columnas.shift();
        valores.shift();

        const query = `UPDATE ${tabla} SET ${columnas.join(" = ?,")}  = ? WHERE ${primary} = ${id}`;

        conex.query(query, valores, (err, result) => {
            if (err) {
                res.status(500).send({ message: 'Error al actualizar el elemento' });
            } else if (result.affectedRows == 0) {
                res.status(404).send({ message: 'elemento no encontrado' });
            } else res.status(201).send({ message: `elemento con el ${primary} ${id} actualizado` });
        });
    });
});

app.delete('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error al obtener las columnas de la tabla ' + tabla });
        result.map(function (col) {
            if (col.Key == "PRI") primary = col.Field;
        });
        const query = `DELETE FROM ${tabla} WHERE ${primary} = ?`;

        conex.query(query, [id], (err, results) => {
            if (err) {
                res.status(500).send({ message: 'Error al eliminar' });
            } else if (results.affectedRows == 0) {
                res.status(404).send({ message: 'elemento con id no encontrado' });
            } else res.send({ message: `Elemento con el ${primary} ${id} eliminado` });
        });
    });
});

app.listen(port, () => console.log(`Server escuchando en el puerto ${port}!`));