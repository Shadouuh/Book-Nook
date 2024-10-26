// Se importan los módulos
const express = require('express');
const path = require('path');
const cors = require('cors');

//Variales de entorno
process.loadEnvFile();

//Se crea la app
const app = express();
const port = process.env.API_PORT || 3001;

// Conexión
const createConnection = require(path.join(__dirname, 'config', 'conexBD'));

let conex;
async function init() {
    conex = await createConnection();
}

init();

// Middlewares
app.use(express.json());
app.use(cors());

// Manejo de errores
const handleError = (res, message, err = null, status = 500) => {
    console.error(message, err);
    res.status(status).send({ message });
};


/*### Endpoints ###*/

//-> Login y registro <-
const userRoutes = require(path.join(__dirname, 'routes', 'userRoutes'));
app.use('/user', userRoutes);

//-> Guardados <-
const savesRoutes = require(path.join(__dirname, 'routes', 'savesRoutes'));
app.use('/save', savesRoutes);

//-> API generales <-
const apiRoutes = require(path.join(__dirname, 'routes', 'apiRoutes'));
app.use('/api', apiRoutes);

//-> Cart <-
const cartRoutes = require(path.join(__dirname, 'routes', 'cartRoutes'));
app.use('/carrito', cartRoutes);



/* -el insert del libro debe guardar en todas las tablas */


//-> Select, show & DESC <-

//Order by




//Show books
app.get('api/libros/ver/:id', async (req, res) => {
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


// DESC table
app.get('/:tabla/desc', async (req, res) => {
    const { tabla } = req.params;

    try {
        const [result] = await conex.execute('DESC ' + tabla);
        if (result.length == 0) return res.status(404).send({ message: 'No se encontró la tabla ' + tabla });

        res.status(200).send({ resultado: result });
    } catch (err) {
        handleError(res, 'Error al obtener las columnas de la tabla ' + tabla, err);
    }
});


app.listen(port, () => console.log(`Server escuchando en el puerto ${port}!`));