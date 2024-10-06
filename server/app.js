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

/*### Endpoints ###*/

app.get('/api/:tabla', (req, res) => {
    const { tabla } = req.params;
    const query = 'SELECT * FROM ' + tabla;

    conex.query(query, (err, results) => {
        if (err) {
            console.error('Error al mostrar', err);
            res.status(500).send('Error en la consulta');
        } else {
            res.send({ resultados: results });
        }
    });
});

app.post('/api/:tabla', (req, res) => {
    const { tabla } = req.params;
    const datos = req.body;

    const queryDesc = `DESC ${tabla}`;
    conex.query(queryDesc, (err, result) => {
        if (err) return res.status(500).send('Error al obtener las columnas de la tabla ' + tabla);

        const columnas = result.map(col => col.Field);
        const valores = columnas.map(col => datos[col]);

        const query = `INSERT INTO ${tabla} (${columnas.join(', ')}) VALUES (${columnas.map(() => '?').join(', ')})`;

        conex.query(query, valores, (err, result) => {
            if (err) return res.status(500).send('Error al insertar los datos');

            res.send(`Datos insertados en la tabla ${tabla}`);
        });
    });
});


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