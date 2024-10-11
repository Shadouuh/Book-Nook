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
    const {user} = req.body;
    const clave = anju.encrypt(user.clave);
    const query = "SELECT id_login, tipo FROM login WHERE email=? OR telefono=? AND clave=?";

    conex.query(query, [user.email, user.telefono,clave], (err, results) => {
        if (err) {
            res.status(401).send({ message: 'Error en el login' });
        }else if(results == "") {
            res.send({message: 'Credenciales incorrectas'});
        } 
        else {
            res.send({ resultado: results });
            console.log('Se logeo correctamente');
        };
    });
});

//Register
app.post('/register', (req, res) => {
    const {user} = req.body;
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
    const { libro_guardar } = req.body;

    const query = `INSERT INTO usuario_libro(estado_lectura, es_favorito, id_libro, id_usuario) VALUES('', '', '${libro_guardar.id_libro}', '${libro_guardar.id_usuario}')`;

    conex.query(query, (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar libro' });
        } else res.status(201).send({ message: 'Se guardo libro correctamente' });
    });
});

//Select by id
app.get('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {

        if (err) return res.status(500).send({message: 'Error al obtener las columnas de la tabla ' + tabla});

        const columnas = result.map(col => col.Field);

        result.map(function (col) {
            if (col.Key == "PRI") primary = col.Field;
        });

        const query = `SELECT * FROM ${tabla} WHERE ${primary} = ${id}`;

        conex.query(query, (err, results) => {
            if (err) {
                res.status(500).send({message: 'Error en la consulta'});
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
            res.status(500).send({message: 'Error en la consulta'});
        } else res.send({ resultados: results });
    });
});

app.post('/api/:tabla', (req, res) => {
    const { tabla } = req.params;
    const datos = req.body;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send({message: 'Error al obtener las columnas de la tabla ' + tabla});

        console.log(result);

        const columnas = result.map(col => col.Field);
        const valores = columnas.map(col => datos[col]);

        const query = `INSERT INTO ${tabla} (${columnas.join(', ')}) VALUES (${columnas.map(() => '?').join(', ')})`;

        conex.query(query, valores, (err, result) => {
            if (err) return res.status(500).send({message:'Error al insertar los datos'});
            res.status(201).send({ message: 'Se inserto correctamente en ' + tabla });
        });
    });
});


app.put('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;
    const datos = req.body;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send({message:'Error al obtener las columnas de la tabla ' + tabla});
        const columnas = result.map(col => col.Field);
        const valores = columnas.map(col => datos[col]);

        result.map(function (col) {
            if (col.Key == "PRI") primary = col.Field;
        });

        columnas.shift();
        valores.shift();

        const query = `UPDATE ${tabla} SET ${columnas.join(" = ?,")}  = ? WHERE ${primary} = ${id}`;

        conex.query(query, valores, (err, result) => {
            if (err) {
                res.status(500).send({message: 'Error al actualizar el elemento'});
            } else if (result.affectedRows == 0) {
                res.status(404).send({ message: 'elemento no encontrado'});
            } else res.status(201).send({ message: `elemento con el ${primary} ${id} actualizado`});
        });
    });
});

app.delete('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send({message: 'Error al obtener las columnas de la tabla ' + tabla});
        result.map(function (col) {
            if (col.Key == "PRI") primary = col.Field;
        });
        const query = `DELETE FROM ${tabla} WHERE ${primary} = ?`;

        conex.query(query, [id], (err, results) => {
            if (err) {
                res.status(500).send({message: 'Error al eliminar'});
            } else if (results.affectedRows == 0) {
                res.status(404).send({message: 'elemento con id no encontrado'});
            } else res.send({message: `Elemento con el ${primary} ${id} eliminado`});
        });
    });
});

app.listen(port, () => console.log(`Server escuchando en el puerto ${port}!`));