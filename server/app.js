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


//Order by


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