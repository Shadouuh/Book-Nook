const path = require('path');
const { router, handleError } = require(path.join(__dirname, '..', 'config', 'setup'));

const createConnection = require(path.join(__dirname, '..', 'config', 'conexBD'));

let conex;
async function init() {
    conex = await createConnection();
}

init();


//busqueda de titulo con LIKE SQL
router.get('/buscar/:titulo', async (req, res) => {
    const { titulo } = req.params;

    try {

        const [books] = await conex.query(
            `SELECT * FROM libros WHERE titulo LIKE "%${titulo}%"`
        );

        if (books.length == 0) return handleError(res, 'No se encontraron libros con ese titulo', null, 404);

        res.status(200).send({ resultados: books });

    } catch (err) {
        return handleError(res, 'Error al buscar el libro', err);
    }
});

//Show books
router.get('/ver', async (req, res) => {
    let resultBooks = [];

    try {

        let [books] = await conex.query('SELECT * FROM libros');

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
                book.autor = autor.length > 0 ? autor[0] : 'Anonimo';
                book.imagenes = imagenes.length > 0 ? imagenes[0] : null;

                resultBooks.push(book);
            }
        } else {
            return handleError(res, 'No hay libros', null, 404);
        }

        res.status(200).send({ book: resultBooks });

    } catch (err) {
        return handleError(res, 'Error al mostrar los libros', err);
    }
});


//Show book by id
router.get('/ver/:id', async (req, res) => {
    const { id } = req.params;
    let resultBooks = [];

    try {

        let [book] = await conex.query(`SELECT * FROM libros WHERE id_libro = ${id}`);

        if (book.length > 0) {
            const [autor] = await conex.query(`SELECT nombre FROM autores WHERE id_autor = ${book[0].id_autor}`);
            const [editorial] = await conex.query(`SELECT nombre FROM editoriales WHERE id_editorial = ${book[0].id_editorial}`);
            const [imagenes] = await conex.query(`SELECT archivo, tipo_angulo FROM libro_imgs WHERE id_libro = ${book[0].id_libro}`);
            const [id_categoria] = await conex.query(`SELECT id_categoria FROM libro_categoria WHERE id_libro = ${book[0].id_libro}`);

            if (id_categoria.length == 0) return handleError(res, 'No se encotraron las categorias', null, 404);

            const [categorias] = await conex.query(`SELECT nombre FROM categorias WHERE id_categoria = ${id_categoria[0].id_categoria}`);
            book.categorias = categorias;

            book.editorial = editorial.length > 0 ? editorial[0].nombre : null;
            book.autor = autor.length > 0 ? autor[0] : 'Anonimo';
            book.imagenes = imagenes.length > 0 ? imagenes[0] : null;

            resultBooks.push(book);
        } else {
            return handleError(res, 'No se encontro el libro', null, 404);
        }

        res.status(200).send({ resultBooks });

    } catch (err) {
        return handleError(res, 'Error al mostrar los libros', err);
    }
});

//Filter book category
router.get('/filtrar', async (req, res) => {
    const { categoria, autor, editorial } = req.query;
    const segun = req.query.segun || 'titulo';
    const orden = req.query.orden || 'asc';
    let books = [];

    try {
        if (categoria) {
            const [id_categoria] = await conex.execute(
                'SELECT id_categoria FROM categorias WHERE nombre = ?',
                [categoria]
            )

            if (id_categoria.length == 0) return handleError(res, 'No se pudo obtener la categoria ' + categoria, null, 404);

            let [id_libro] = await conex.execute(
                'SELECT id_libro FROM libro_categoria WHERE id_categoria = ?',
                [id_categoria[0].id_categoria]
            )
            if (id_libro.length == 0) return handleError(res, 'No se pudo obtener los datos de la tabla intermedia', null, 404);

            [books] = await conex.query(
                `SELECT * FROM libros WHERE id_libro IN (${id_libro.map(id => id.id_libro).join(', ')}) ORDER BY ${segun} ${orden}`
            );

            if (books.length == 0) return handleError(res, 'No hay libros con la categoria ' + categoria, null, 404);

        }
        if (autor) {
            const [id_autor] = await conex.execute(
                'SELECT id_autor FROM autores WHERE nombre = ?',
                [autor]
            )
            if (id_autor.length == 0) return handleError(res, 'No se pudo obtener el autor ' + autor, null, 404);

            [books] = await conex.execute(
                `SELECT * FROM libros WHERE id_autor = ? ORDER BY ${segun} ${orden}`,
                [id_autor[0].id_autor]
            );
            if (books.length == 0) return handleError(res, 'No hay libros con el autor ' + autor, null, 404);

        }
        if (editorial) {
            const [id_editorial] = await conex.execute(
                'SELECT id_editorial FROM editoriales WHERE nombre = ?',
                [editorial]
            )
            if (id_editorial.length == 0) return handleError(res, 'No se pudo obtener la editorial ' + editorial, null, 404);

            [books] = await conex.execute(
                `SELECT * FROM libros WHERE id_editorial = ? ORDER BY ${segun} ${orden}`,
                [id_editorial[0].id_editorial]
            );
            if (books.length == 0) return handleError(res, 'No hay libros con la editorial ' + editorial, null, 404);
        }
        res.status(200).send({ resultados: books });

    } catch (err) {
        return handleError(res, 'Error al filtrar el libro', err);
    }
});

// //Filter book autor
// router.get('/autor/:valor', async (req, res) => {
//     const { valor } = req.params;
//     const segun = req.query.segun || 'titulo';
//     const orden = req.query.orden || 'asc';

//     try {
//         const [id_autor] = await conex.execute(
//             'SELECT id_autor FROM autores WHERE nombre = ?',
//             [valor]
//         )
//         if (id_autor.length == 0) return handleError(res, 'No se pudo obtener el autor ' + valor, null, 404);

//         const [books] = await conex.execute(
//             `SELECT * FROM libros WHERE id_autor = ? ORDER BY ${segun} ${orden}`,
//             [id_autor[0].id_autor]
//         );
//         if (books.length == 0) return handleError(res, 'No hay libros con el autor ' + valor, null, 404);

//         res.status(200).send({ resultados: books });

//     } catch (err) {
//         return handleError(res, 'Error al filtrar el libro', err);
//     }
// });

// //Filter book editorial
// router.get('/editorial/:valor', async (req, res) => {
//     const { valor } = req.params;
//     const segun = req.query.segun || 'titulo';
//     const orden = req.query.orden || 'asc';

//     try {
//         const [id_editorial] = await conex.execute(
//             'SELECT id_editorial FROM editoriales WHERE nombre = ?',
//             [valor]
//         )
//         if (id_editorial.length == 0) return handleError(res, 'No se pudo obtener la editorial ' + valor, null, 404);

//         const [books] = await conex.execute(
//             `SELECT * FROM libros WHERE id_editorial = ? ORDER BY ${segun} ${orden}`,
//             [id_editorial[0].id_editorial]
//         );
//         if (books.length == 0) return handleError(res, 'No hay libros con la editorial ' + valor, null, 404);

//         res.status(200).send({ resultados: books });

//     } catch (err) {
//         return handleError(res, 'Error al filtrar el libro', err);
//     }
// });

//Filter dinamic
// router.get('/:clave/:valor', async (req, res) => {
//     const { clave, valor } = req.params;
//     const segun = req.query.segun || 'titulo';
//     const orden = req.query.orden || 'asc';

//     try {
//         const [books] = await conex.execute(
//             `SELECT * FROM libros WHERE ${clave} = ? ORDER BY ${segun} ${orden}`,
//             [valor]
//         );
//         if (books.length == 0) return handleError(res, `No hay libros con: ${clave} = ${valor} `, null, 404);

//         res.status(200).send({ resultados: books });

//     } catch (err) {
//         return handleError(res, 'Error al filtrar el libro', err);
//     }
// });

module.exports = router;
