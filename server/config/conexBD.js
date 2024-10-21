<<<<<<< HEAD
const mysql = require('mysql2/promise');

async function createConnection() {
    try {
        const conex = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'book-nook-bd'
        });

        console.log('Conexion exitosa!!!');
        return conex;

    } catch (err) {
        console.error('Error en la conexion', err);
        throw err;
    }
};

=======
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

>>>>>>> 5a60ae304e9bad0a897c2d236f77bc1e75e2996b
module.exports = createConnection;