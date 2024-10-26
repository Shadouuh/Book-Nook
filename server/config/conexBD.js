const mysql = require('mysql2/promise');

process.loadEnvFile();

async function createConnection() {
    try {
        const conex = await mysql.createPool({
            host: process.env.host,
            user: process.env.user,
            password: process.env.pass,
            database: process.env.db,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log('Conexion exitosa!!!');
        return conex;

    } catch (err) {
        console.error('Error en la conexion', err);
        throw err;
    }
};

module.exports = createConnection;