const mysql = require('mysql2')

const conex = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'libreria_bd',
    port: 3306
})

conex.connect((err)=> {
    if(err) console.error('Error en la conexion', err)
    else console.log('Conexion exitosa!!!')
})

module.exports = conex