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

    const verifi = "SELECT id_login FROM login WHERE email=? OR telefono=?";

    conex.query(verifi, [user.email, user.telefono], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error en la verificación', error: err });
        else if (result == "") {
            res.status(401).send({ message: 'No existe cuenta con el email ' + user.email });
        } else {
            const query = "SELECT id_login, tipo FROM login WHERE email=? OR telefono=? AND clave=?";

            conex.query(query, [user.email, user.telefono, clave], (err, results) => {
                if (err) return res.status(500).send({ message: 'Error en el login', error: err });
                else if (results == "") {
                    res.send({ message: 'Credenciales incorrectas' });
                }
                else {
                    res.send({ resultado: results });
                };
            });
        }
    });
});

//Register
app.post('/register', (req, res) => {
    const { user } = req.body;
    const clave = anju.encrypt(user.clave);

    const verifiMail = "SELECT id_login FROM login WHERE email=?";

    conex.query(verifiMail, [user.email], (err, result) => {
        if (err) return res.status(500).send({ message: 'Error en la verificación del email', error: err });
        else if (result != "") {
            res.status(401).send({ message: `El email: ${user.email} ya esta tiene cuenta` });
        } else {
            const queryTel = "SELECT telefono FROM login WHERE telefono=?";

            conex.query(queryTel, [user.telefono], (err, results) => {
                if (err) return res.status(500).send({ message: 'Error en la verificacion del telefono', error: err });
                else if (user.telefono && results != "") {
                    if (results[0].telefono == user.telefono) {
                        res.status(401).send({ message: `El telefono: ${user.telefono} ya esta registrado` });
                    }
                } else {
                    const query = "INSERT INTO login(email, telefono, clave, tipo) VALUES(?, ?, ?, 'cliente');";

                    conex.query(query, [user.email, user.telefono, clave], (err, results) => {
                        if (err) return res.status(500).send({ message: 'Error al insertar en login', error: err });
                        else {
                            let hoy = new Date().toLocaleDateString();
                            const query2 = `INSERT INTO usuarios(nombre, apellido, direccion, fecha_registro, fecha_nacimiento, alias, id_login) VALUES(?,?,?,'${hoy}' ,?,?, ${results.insertId})`;
                            conex.query(query2, [user.nombre, user.apellido, user.direccion, user.fecha_nacimiento, user.alias], (err, result) => {
                                if (err) return res.status(500).send({ message: 'Error al insertar en usuarios', error: err });
                                else {
                                    res.status(201).send({ message: 'Se registro correctamente el usuario' });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

//Save book
app.post('/api/libros/guardar', (req, res) => {
    const { save } = req.body;
    const verifi = `SELECT id_ul FROM usuario_libro WHERE id_libro = '${save.id_libro}' AND  id_usuario = '${save.id_usuario}'`;

    conex.query(verifi, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error en la consulta de verificación', error: err });
        else if (result != "") {
            res.status(401).send({ message: 'El libro ya esta guardado' });
        } else {
            const query = `INSERT INTO usuario_libro(id_libro, id_usuario) VALUES('${save.id_libro}', '${save.id_usuario}')`;

            conex.query(query, (err, results) => {
                if (err) return res.status(500).send({ message: 'Error al guardar el libro', error: err });
                else res.status(201).send({ message: 'Se guardo el libro' });
            });
        }
    });
});

//Toggle fav book
app.post('/api/libros/cambiarFavorito', (req, res) => {
    const { save } = req.body;
    let query;

    const verifi = `SELECT es_favorito FROM usuario_libro WHERE id_libro = '${save.id_libro}' AND  id_usuario = '${save.id_usuario}'`;

    conex.query(verifi, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error en la consulta de verificación', error: err });
        else if (result == "") {
            query = `INSERT INTO usuario_libro(es_favorito, id_libro, id_usuario) VALUES(1, ${save.id_libro}, ${save.id_usuario})`;

            conex.query(query, (err, results) => {
                if (err) return res.status(500).send({ message: 'Error al insertar como favorito el libro', error: err });
                else res.status(201).send({ message: 'Se logro hacer lo del libro' });
            });
        } else {
            query = `UPDATE usuario_libro SET es_favorito = ${!result[0].es_favorito} WHERE id_libro = '${save.id_libro}' AND  id_usuario = '${save.id_usuario}'`;

            conex.query(query, (err, results) => {
                if (err) return res.status(500).send({ message: 'Error al poner como favorito el libro', error: err });
                else res.status(201).send({ message: 'Se logro hacer lo del libro' });
            });
        }
    });
});

//Save autor
app.post('/api/autores/guardar', (req, res) => {
    const { save } = req.body;
    const verifi = `SELECT id_au FROM usuario_autor WHERE id_autor = '${save.id_autor}' AND  id_usuario = '${save.id_usuario}'`;

    conex.query(verifi, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error en la consulta de verificación', error: err });
        else if (result != "") {
            res.status(500).send({ message: 'El autor ya esta guardado' });
        } else {
            const query = `INSERT INTO usuario_autor(id_autor, id_usuario) VALUES('${save.id_autor}', '${save.id_usuario}')`;

            conex.query(query, (err, results) => {
                if (err) return res.status(500).send({ message: 'Error al guardar el autor favorito', error: err });
                else res.status(201).send({ message: 'Se guardo el autor como favorito' });
            });
        }
    });
});

//Save category
app.post('/api/categorias/guardar', (req, res) => {
    const { save } = req.body;
    const verifi = `SELECT id_uc FROM usuario_categoria WHERE id_categoria = '${save.id_categoria}' AND  id_usuario = '${save.id_usuario}'`;

    conex.query(verifi, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error en la consulta de verificación', error: err });
        else if (result != "") {
            res.status(500).send({ message: 'La categoria ya esta guardada' });
        } else {
            const query = `INSERT INTO usuario_categoria(id_categoria, id_usuario) VALUES('${save.id_categoria}', '${save.id_usuario}')`;

            conex.query(query, (err, results) => {
                if (err) return res.status(500).send({ message: 'Error al guardar categoria favorita', error: err });
                else res.status(201).send({ message: 'Se guardo la categoria como favorita' });
            });
        }
    });
});

//Select by id
app.get('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {

        if (err) return res.status(500).send({ message: 'Error al obtener las columnas de la tabla ' + tabla, error: err });
        result.map(function (col) {
            if (col.Key == 'PRI') primary = col.Field;
        });

        const query = `SELECT * FROM ${tabla} WHERE ${primary} = ${id}`;

        conex.query(query, (err, results) => {
            if (err) return res.status(500).send({ message: 'Error en la consulta', error: err });
            else if (results == "") {
                res.status(404).send({ message: 'No se encontro el elemento' });
            }
            else res.send({ resultados: results });
        });
    });
});

//DESC table
app.get('/:tabla/desc', (req, res) => {
    const { tabla } = req.params;
    const queryDesc = 'DESC ' + tabla;

    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error al obtener las columnas de la tabla ' + tabla, error: err });
        else if (result == "") {
            res.status(404).send({ message: 'No se encontro la tabla ' + tabla });
        }
        else {
            res.status(200).send({ resultado: result });
        }
    });
});

//CRUD
app.get('/api/:tabla', (req, res) => {
    const { tabla } = req.params;
    const query = 'SELECT * FROM ' + tabla;

    conex.query(query, (err, results) => {
        if (err) return res.status(500).send({ message: 'Error en la consulta', error: err });
        else res.send({ resultados: results });
    });
});

app.post('/api/:tabla', (req, res) => {
    const { tabla } = req.params;
    const { dates } = req.body;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error al obtener las columnas de la tabla ' + tabla, error: err });
        else if (result == "") {
            res.status(404).send({ message: 'No se encontro la tabla ' + tabla });
        } else {
            const columnas = result.map(col => col.Field);
            const valores = columnas.map(col => dates[col]);

            const campos = result.map(col => col.Field);
            const tipos = result.map(col => col.Type);

            const query = `INSERT INTO ${tabla} (${columnas.join(', ')}) VALUES (${columnas.map(() => '?').join(', ')})`;

            conex.query(query, valores, (err, result) => {
                if (err) return res.status(500).send({ message: 'Error al insertar los datos', error: err });
                res.status(201).send({ message: 'Se inserto correctamente en ' + tabla });
            });
        }
    });
});

app.put('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;
    const { dates } = req.body;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error al obtener las columnas de la tabla ' + tabla, error: err });
        else if (result == "") {
            res.status(404).send({ message: 'No se encontro la tabla ' + tabla });
        } else {
            const columnas = result.map(col => col.Field);
            const valores = columnas.map(col => dates[col]);

            result.map(function (col) {
                if (col.Key == "PRI") primary = col.Field;
            });

            columnas.shift();
            valores.shift();

            const query = `UPDATE ${tabla} SET ${columnas.join(" = ?,")}  = ? WHERE ${primary} = ${id}`;

            conex.query(query, valores, (err, result) => {
                if (err) return res.status(500).send({ message: 'Error al actualizar el elemento', error: err });
                else if (result.affectedRows == 0) {
                    res.status(404).send({ message: 'elemento no encontrado' });
                } else res.status(201).send({ message: `elemento con el ${primary} ${id} actualizado` });
            });
        }
    });
});

app.delete('/api/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;

    const queryDesc = 'DESC ' + tabla;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error al obtener las columnas de la tabla ' + tabla, error: err });
        else if (result == "") {
            res.status(404).send({ message: 'No se encontro la tabla ' + tabla });
        } else {
            result.map(function (col) {
                if (col.Key == "PRI") primary = col.Field;
            });
            const query = `DELETE FROM ${tabla} WHERE ${primary} = ?`;

            conex.query(query, [id], (err, results) => {
                if (err) return res.status(500).send({ message: 'Error al eliminar', error: err });
                else if (results.affectedRows == 0) {
                    res.status(404).send({ message: 'elemento con id no encontrado' });
                } else res.send({ message: `Elemento con el ${primary} ${id} eliminado` });
            });
        }
    });
});

app.listen(port, () => console.log(`Server escuchando en el puerto ${port}!`));