const path = require('path');
const anju = require('anju-js');
const { router, handleError } = require(path.join(__dirname, '..', 'config', 'setup'));

const createConnection = require(path.join(__dirname, '..', 'config', 'conexBD'));

let conex;
async function init() {
    conex = await createConnection();
}

init();

router.post('/login', async (req, res) => {
    try {
        const { user } = req.body;
        const clave = anju.encrypt(user.clave);

        let login;
        let resultAlias;

        const [result] = await conex.execute(
            'SELECT id_login FROM login WHERE email = ? OR telefono = ?',
            [user.key, user.key]
        );

        if (result.length == 0) {
            [resultAlias] = await conex.execute('SELECT id_login FROM usuarios WHERE alias = ?', [user.key]);
            if (resultAlias.length == 0) return handleError(res, 'no se encotro la cuenta', null, 404);

            [login] = await conex.execute(
                'SELECT id_login, tipo FROM login WHERE id_login = ? AND clave=?',
                [resultAlias[0].id_login, clave]
            );
        } else {
            [login] = await conex.execute(
                'SELECT id_login, tipo FROM login WHERE (email = ? OR telefono = ?) AND clave=?',
                [user.key, user.key, clave]
            );
        }

        if (login.length == 0) return handleError(res, 'Credenciales incorrectas', null, 400);
        const [resultUser] = await conex.query(`SELECT * FROM usuarios WHERE id_login = ${login[0].id_login}`);

        res.send({ login: login, user: resultUser });
    } catch (err) {
        return handleError(res, 'Error en el login', err);
    }
});

//Register
router.post('/register', async (req, res) => {
    const { user } = req.body;
    const clave = anju.encrypt(user.clave);

    try {
        const [emailResult] = await conex.execute('SELECT id_login FROM login WHERE email=?', [user.email]);
        if (emailResult.length > 0) return handleError(res, `El email: ${user.email} ya tiene una cuenta registrada`, null, 409);

        const [telefonoResult] = await conex.execute('SELECT telefono FROM login WHERE telefono=?', [user.telefono]);
        if (telefonoResult.length > 0) return handleError(res, `El teléfono: ${user.telefono} ya está registrado`, null, 409);

        const [loginResult] = await conex.execute(
            "INSERT INTO login(email, telefono, clave, tipo) VALUES(?, ?, ?, 'cliente')",
            [user.email, user.telefono, clave]
        );

        if (loginResult.affectedRows == 0) return handleError(res, 'Error al insertar en login');

        const [alias] = await conex.execute('SELECT alias FROM usuarios WHERE alias = ?', [user.alias]);
        if (alias.length > 0) {
            await conex.execute(
                'DELETE FROM login WHERE id_login = ?',
                [loginResult.insertId]
            )
            return handleError(res, `El alias ${user.alias} ya esta registrado`, null, 409)
        };

        const [userResult] = await conex.execute(
            'INSERT INTO usuarios(nombre, apellido, direccion, fecha_nacimiento, alias, id_login) VALUES(?, ?, ?, ?, ?, ?)',
            [user.nombre, user.apellido, user.direccion, user.fecha_nacimiento, user.alias, loginResult.insertId]
        );

        if (userResult.affectedRows == 0) return handleError(res, 'Error al insertar en usuarios');

        await conex.execute('INSERT INTO carrito(id_usuario, es_actual) VALUES(?, true)', [userResult.insertId]);

        res.status(201).send({ message: 'Se registró correctamente el usuario' });
    } catch (err) {
        return handleError(res, 'Error al registrar el usuario', err);
    }
});

module.exports = router;