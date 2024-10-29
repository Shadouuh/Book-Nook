const path = require('path');
const { execArgv } = require('process');
const { router, handleError } = require(path.join(__dirname, '..', 'config', 'setup'));

const createConnection = require(path.join(__dirname, '..', 'config', 'conexBD'));

let conex;
async function init() {
    conex = await createConnection();
}

init();

//Select by order
router.get('/:tabla/ordenar/:segun', async (req, res) => {
    const { tabla, segun } = req.params;
    const orden = req.query.orden || 'asc';

    try {
        const [results] = await conex.execute(`SELECT * FROM ${tabla} ORDER BY ${segun} ${orden}`);
        res.send({ resultados: results });
    } catch (err) {
        return handleError(res, 'Error en la consulta', err);
    }
});

// Select by id
router.get('/:tabla/id/:id', async (req, res) => {
    const { tabla, id } = req.params;

    try {
        const [result] = await conex.execute('DESC ' + tabla);
        const primaryKey = result.find(col => col.Key == 'PRI').Field;

        const [results] = await conex.execute(`SELECT * FROM ${tabla} WHERE ${primaryKey} = ?`, [id]);

        if (results.length == 0) return handleError(res, 'No se encontró el elemento', null, 404);

        res.send({ resultados: results });
    } catch (err) {
        return handleError(res, 'Error en la consulta', err);
    }
});

// DESC table
router.get('/:tabla/desc', async (req, res) => {
    const { tabla } = req.params;

    try {
        const [result] = await conex.execute('DESC ' + tabla);
        if (result.length == 0) return res.status(404).send({ message: 'No se encontró la tabla ' + tabla });

        res.status(200).send({ resultado: result });
    } catch (err) {
        handleError(res, 'Error al obtener las columnas de la tabla ' + tabla, err);
    }
});

// -> CRUD <-

//Select table
router.get('/:tabla', async (req, res) => {
    const { tabla } = req.params;

    try {
        const [results] = await conex.execute('SELECT * FROM ' + tabla);

        if (results.length == 0) return handleError(res, 'No se encontraron elementos', null, 404);

        res.send({ resultados: results });
    } catch (err) {
        return handleError(res, 'Error en la consulta', err);
    }
});

//Insert into table
router.post('/:tabla', async (req, res) => {
    const { tabla } = req.params;
    const { dates } = req.body;

    try {
        const [columns] = await conex.execute('DESC ' + tabla);
        let columnFields = columns.map(col => col.Field);
        let columnValues = columnFields.map(col => dates[col]);

        columnFields.shift();
        columnValues.shift();

        const query = `INSERT INTO ${tabla} (${columnFields.join(', ')}) VALUES (${columnFields.map(() => '?').join(', ')})`;
        await conex.execute(query, columnValues);

        res.status(201).send({ message: 'Se insertó correctamente en ' + tabla });
    } catch (err) {
        return handleError(res, 'Error al insertar los datos', err);
    }
});

//Update by id
router.put('/:tabla/:id', async (req, res) => {
    const { tabla, id } = req.params;
    const { dates } = req.body;

    try {
        const [columns] = await conex.execute('DESC ' + tabla);
        const primaryKey = columns.find(col => col.Key == 'PRI').Field;
        const columnFields = columns.map(col => col.Field).slice(1);
        const columnValues = columnFields.map(col => dates[col]);

        const query = `UPDATE ${tabla} SET ${columnFields.join(' = ?, ')} = ? WHERE ${primaryKey} = ?`;
        await conex.execute(query, [...columnValues, id]);

        res.status(201).send({ message: `Elemento con el ${primaryKey} ${id} actualizado` });
    } catch (err) {
        return handleError(res, 'Error al actualizar el elemento', err);
    }
});

//Delete by id
router.delete('/:tabla/:id', async (req, res) => {
    const { tabla, id } = req.params;

    try {
        const [columns] = await conex.execute('DESC ' + tabla);
        const primaryKey = columns.find(col => col.Key == 'PRI').Field;

        const query = `DELETE FROM ${tabla} WHERE ${primaryKey} = ?`;
        const [results] = await conex.execute(query, [id]);

        if (results.affectedRows == 0) return handleError(res, 'Elemento no encontrado', null, 404);

        res.send({ message: `Elemento con el ${primaryKey} ${id} eliminado` });
    } catch (err) {
        return handleError(res, 'Error al eliminar el elemento', err);
    }
});

module.exports = router;