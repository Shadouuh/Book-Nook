const mysql = require('mysql2/promise');

async function createConnection() {
    try {
        const conex = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'libreria_bd'
        });

        console.log('Conexion exitosa!!!');
        return conex;

    } catch (err) {
        console.error('Error en la conexion', err);
        throw err;
    }
};

module.exports = createConnection;