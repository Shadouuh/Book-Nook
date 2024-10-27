const path = require('path');
const { connected } = require('process');
const { createContext } = require('vm');
const { router, handleError } = require(path.join(__dirname, '..', 'config', 'setup'));

const createConnection = require(path.join(__dirname, '..', 'config', 'conexBD'));

let conex;
async function init() {
    conex = await createConnection();
}

init();


//busqueda de titulo con LIKE SQL





//Filter book category
router.get('/categoria/:valor', async (req, res) => {
    const { valor } = req.params;
    let books = [];

    try {
        const [id_categoria] = await conex.execute(
            'SELECT id_categoria FROM categorias WHERE nombre = ?',
            [valor]
        )
        if (id_categoria.length == 0) handleError(res, 'No se pudo obtener la categoria ' + valor, null, 404);

        const [id_libro] = await conex.execute(
            'SELECT id_libro FROM libro_categoria WHERE id_categoria = ?',
            [id_categoria[0].id_categoria]
        )
        if (id_libro.length == 0) handleError(res, 'No se pudo obtener los datos de la tabla intermedia', null, 404);

        for (const item of id_libro) {
            [book] = await conex.execute(
                'SELECT * FROM libros WHERE id_libro = ?',
                [item.id_libro]
            );
            books.push(book);
        }
            if (books.length == 0) handleError(res, 'No hay libros con la categoria ' + valor, null, 404);

        res.status(200).send({ resultados: books });

    } catch (err) {
        handleError(res, 'Error al filtrar el libro', err);
    }
});

//Filter book autor
router.get('/autor/:valor', async (req, res) => {
    const { valor } = req.params;

    try {
        const [id_autor] = await conex.execute(
            'SELECT id_autor FROM autores WHERE nombre = ?',
            [valor]
        )
        if (id_autor.length == 0) handleError(res, 'No se pudo obtener el autor ' + valor, null, 404);

        const [books] = await conex.execute(
            'SELECT * FROM libros WHERE id_autor = ?',
            [id_autor[0].id_autor]
        );
        if (books.length == 0) handleError(res, 'No hay libros con el autor ' + valor, null, 404);

        res.status(200).send({ resultados: books });

    } catch (err) {
        handleError(res, 'Error al filtrar el libro', err);
    }
});

//Filter book editorial
router.get('/editorial/:valor', async (req, res) => {
    const { valor } = req.params;

    try {
        const [id_editorial] = await conex.execute(
            'SELECT id_editorial FROM editoriales WHERE nombre = ?',
            [valor]
        )
        if (id_editorial.length == 0) handleError(res, 'No se pudo obtener la editorial ' + valor, null, 404);

        const [books] = await conex.execute(
            'SELECT * FROM libros WHERE id_editorial = ?',
            [id_editorial[0].id_editorial]
        );
        if (books.length == 0) handleError(res, 'No hay libros con la editorial ' + valor, null, 404);

        res.status(200).send({ resultados: books });

    } catch (err) {
        handleError(res, 'Error al filtrar el libro', err);
    }
});

//Filter dinamic
router.get('/:segun/:valor', async (req, res) => {
    const { segun, valor } = req.params;

    try {
        const [books] = await conex.execute(
            `SELECT * FROM libros WHERE ${segun} = ?`,
            [valor]
        );
        if (books.length == 0) handleError(res, `No hay libros con: ${segun} = ${valor} `, null, 404);

        res.status(200).send({ resultados: books });

    } catch (err) {
        handleError(res, 'Error al filtrar el libro', err);
    }
});

//Show book by id
router.get('/ver/:id', async (req, res) => {
    const { id } = req.params;
    let resultBooks = [];

    try {

        let [books] = await conex.query(`SELECT * FROM libros WHERE id_libro = ${id}`);

        if (books.length > 0) {
            for (const book of books) {
                const [autor] = await conex.query(`SELECT nombre FROM autores WHERE id_autor = ${book.id_autor}`);
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

module.exports = router;
