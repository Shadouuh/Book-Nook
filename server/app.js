// Se importan los módulos
const express = require('express');
const cors = require('cors');
const anju = require('anju-js');
const conex = require('./config/conexBD');

const app = express();
const port = 3000;


// Middlewares
app.use(express.json());
app.use(cors());


/* ## ----> Endpoints <---- ## */

// Login
app.post('/login', (req, res) => {
    let { email, clave } = req.body;
    clave = anju.encrypt(clave);
    const query = "SELECT id_login, tipo FROM login WHERE email=? AND clave=?";

    conex.query(query, [email, clave],(err, results) => {
        if (err || results == "") {
            console.error('Error al logearse', err);
            res.status(401).send('Credenciales incorrectas');
        } else {
            res.send({ resultado: results});
            console.log('Se logeo correctamente');
        };
    });
});

// Register
app.post('/register', (req, res) => {
    let { email, telefono, clave } = req.body;
    clave = anju.encrypt(clave);

    const query = "INSERT INTO login(email, telefono, clave, tipo) VALUES(?, ?, ?, 'cliente')";

    conex.query(query, [email, telefono, clave ], (err, results) => {
        if (err) {
            console.error('Error al registrarse', err);
            res.status(401).send('Credenciales incorrectas');
        } else res.send({ message: 'Se registro correctamente'});
    });
});

// Select by ID
app.get('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {

        if (err) return res.status(500).send('Error al obtener las columnas de la tabla ' + tabla);

        const columnas = result.map(col => col.Field);

        result.map(function (col) {
            if (col.Key == "PRI") primary = col.Field;
        });

        const query = `SELECT * FROM ${tabla} WHERE ${primary} = ${id}`;

        conex.query(query, (err, results) => {
            if (err) {
                console.error('Error al mostrar', err);
                res.status(500).send('Error en la consulta');
            } else res.send({ resultados: results });
        });
    });


});

/* ## ----> CRUD <---- ## */

// Read
app.get('/api/:tabla', (req, res) => {
    const { tabla } = req.params;
    const query = 'SELECT * FROM ' + tabla;

    conex.query(query, (err, results) => {
        if (err) {
            console.error('Error al mostrar', err);
            res.status(500).send('Error en la consulta');
        } else res.send({ resultados: results });
    });
});

// Create
app.post('/api/:tabla', (req, res) => {
    const { tabla } = req.params;
    const datos = req.body;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send('Error al obtener las columnas de la tabla ' + tabla);

        const columnas = result.map(col => col.Field);
        const valores = columnas.map(col => datos[col]);

        const query = `INSERT INTO ${tabla} (${columnas.join(', ')}) VALUES (${columnas.map(() => '?').join(', ')})`;

        conex.query(query, valores, (err, result) => {
            if (err) return res.status(500).send('Error al insertar los datos');

            res.send({ message: 'Se inserto correctamente en ' + tabla});
        });
    });
});

// Insert
app.put('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;
    const datos = req.body;

    const queryDesc = `DESC ${tabla}`;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send('Error al obtener las columnas de la tabla ' + tabla);
        const columnas = result.map(col => col.Field);
        const valores = columnas.map(col => datos[col]);

        result.map(function (col) {
            if (col.Key == "PRI") primary = col.Field;
        });

        columnas.shift();
        valores.shift();

        columnas[columnas.length - 1] = columnas[columnas.length - 1] + " = ?";

        const query = `UPDATE ${tabla} SET ${columnas.join(" = ?,")} WHERE ${primary} = ?`;

        valores.push(id);

        conex.query(query, valores, (err, result) => {
            if (err) {
                console.error('Error al actualizar el elemento:', err);
                res.status(500).send('Error al actualizar el elemento');
            } else if (result.affectedRows === 0) {
                res.status(404).send('elemento no encontrado');
            } else {
                res.send(`elemento con el ${primary} ${id} actualizado`);
            }
        });
    });

});

// Delete
app.delete('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send('Error al obtener las columnas de la tabla ' + tabla);
        result.map(function (col) {
            if (col.Key == "PRI") primary = col.Field;
        });
        const query = `DELETE FROM ${tabla} WHERE ${primary} = ?`;

        conex.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error al eliminar:', err);
                res.status(500).send('Error al eliminar');
            } else if (results.affectedRows === 0) {
                res.status(404).send('elemento con id no encontrado');
            } else {
                res.send(`Elemento con el ${primary} ${id} eliminado`);
            }
        });
    });
});

app.listen(port, () => console.log(`Server escuchando en el puerto ${port}!`));