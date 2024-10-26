const path = require('path');
const { router, handleError } = require(path.join(__dirname, '..', 'config', 'setup'));

const createConnection = require(path.join(__dirname, '..', 'config', 'conexBD'));

let conex;
async function init() {
    conex = await createConnection();
}

init();

//Show book by id
app.get('/libros/ver/:id', async (req, res) => {
    const { id } = req.params;
    let resultBooks = [];

    try {

        let [books] = await conex.query(`SELECT * FROM libros WHERE id_libro = ${id}`);

        if (books.length > 0) {
            for (const book of books) {
                const [autor] = await conex.query(`SELECT nombre, apellido FROM autores WHERE id_autor = ${book.id_autor}`);
                const [editorial] = await conex.query(`SELECT nombre FROM editoriales WHERE id_editorial = ${book.id_editorial}`);
                const [imagenes] = await conex.query(`SELECT archivo, tipo_angulo FROM libro_imgs WHERE id_libro = ${book.id_libro}`);
                const [id_categoria] = await conex.query(`SELECT id_categoria FROM libro_categoria WHERE id_libro = ${book.id_libro}`);

                if (id_categoria.length == 0) return handleError(res, 'No se encotraron las categorias', null, 404);

                const [categorias] = await conex.query(`SELECT nombre FROM categorias WHERE id_categoria = ${id_categoria[0].id_categoria}`);
                book.categorias = categorias;

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

//Select by order
router.get('/:tabla/ordenar/:segun', async (req, res) => {
    const { tabla, segun } = req.params;
    const orden = req.query.orden || 'asc';

    try {
        const [results] = await conex.execute(`SELECT * FROM ${tabla} ORDER BY ${segun} ${orden}`);
        res.send({ resultados: results });
    } catch (err) {
        handleError(res, 'Error en la consulta', err);
    }
});

// Select by id
router.get('/:tabla/id/:id', async (req, res) => {
    const { tabla, id } = req.params;

    try {
        const [result] = await conex.execute('DESC ' + tabla);
        const primaryKey = result.find(col => col.Key == 'PRI').Field;

        const [results] = await conex.execute(`SELECT * FROM ${tabla} WHERE ${primaryKey} = ?`, [id]);

        if (results.length == 0) return res.status(404).send({ message: 'No se encontró el elemento' });

        res.send({ resultados: results });
    } catch (err) {
        handleError(res, 'Error en la consulta', err);
    }
});

// -> CRUD <-

//Select table
router.get('/:tabla', async (req, res) => {
    const { tabla } = req.params;

    try {
        const [results] = await conex.execute('SELECT * FROM ' + tabla);
        res.send({ resultados: results });
    } catch (err) {
        handleError(res, 'Error en la consulta', err);
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
        handleError(res, 'Error al insertar los datos', err);
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
        handleError(res, 'Error al actualizar el elemento', err);
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

        if (results.affectedRows == 0) return res.status(404).send({ message: 'Elemento no encontrado' });

        res.send({ message: `Elemento con el ${primaryKey} ${id} eliminado` });
    } catch (err) {
        handleError(res, 'Error al eliminar el elemento', err);
    }
});

module.exports = router;