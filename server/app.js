// Se importan los módulos
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Conexión
const conex = require(path.join(__dirname, 'config', 'conexBD'));

// Middlewares
app.use(express.json());
app.use(cors());

// Endpoints
app.get('/', (req, res) => {
    const query = 'SELECT * FROM libros';

    conex.query(query, (err, results) => {
        if (err) {
            console.error('Error al mostrar', err);
            res.status(500).send('Error en la consulta');
        } else {
            res.send({ productos: results });
        }
    });
});

app.post('/libros', (req, res) => {
    const { titulo, descripcion, precio, stock, es_fisico, fecha_publicacion, id_editorial, id_autor } 
    = req.body;
    const query = 
    'INSERT INTO libros (titulo, descripcion, precio, stock, es_fisico, fecha_publicacion, id_editorial, id_autor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    conex.query(query, [titulo, descripcion, precio, stock, es_fisico, fecha_publicacion, id_editorial, id_autor ], (err, result) => {
        if (err) {
            console.error('Error al insertar el libro:', err);
            res.status(500).send('Error al insertar el libro');
        } else {
            res.status(201).send(`Libro agregado con Id ${result.insertId}`);
        }
    });
});

app.put('/libros/:id', (req, res) => {
    const { id } = req.params;  
    const { titulo, descripcion, precio, stock, es_fisico, fecha_publicacion, id_editorial, id_autor  } = req.body;
    const query = 'UPDATE libros SET titulo = ?, descripcion = ?, precio = ?, stock = ?, es_fisico = ?, fecha_publicacion = ?, id_editorial = ?, id_autor = ?  WHERE id_libro = ?';

    conex.query(query, [titulo, descripcion, precio, stock, es_fisico, fecha_publicacion, id_editorial, id_autor, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el libro:', err);
            res.status(500).send('Error al actualizar el libro');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Libro no encontrado');
        } else {
            res.send(`Libro con el Id ${id} actualizado`);
        }
    });
});

app.delete('/libros/:id', function (req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM libros WHERE id_libro = ?';

    conex.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar el libro:', err);
            res.status(500).send('Error al eliminar el libro');
        } else if (results.affectedRows === 0) {
            res.status(404).send('Libro no encontrado');
        } else {
            res.send(`Libro con el ID ${id} eliminado`);
        }
    });
});

app.listen(port, () => console.log(`Server escuchando en el puerto ${port}!`));