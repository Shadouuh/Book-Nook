const path = require('path');
const { router, handleError } = require(path.join(__dirname, '..', 'config', 'setup'));

const createConnection = require(path.join(__dirname, '..', 'config', 'conexBD'));

let conex;
async function init() {
    conex = await createConnection();
}

init();

// Save book
router.post('/libro', async (req, res) => {
    const { save } = req.body;
    const verifi = `SELECT id_ul FROM usuario_libro WHERE id_libro = ? AND id_usuario = ?`;

    try {
        const [result] = await conex.execute(verifi, [save.id_libro, save.id_usuario]);

        if (result.length > 0) return handleError(res, 'El libro ya está guardado', null, 409);

        const query = `INSERT INTO usuario_libro(id_libro, id_usuario) VALUES(?, ?)`;
        await conex.execute(query, [save.id_libro, save.id_usuario]);

        res.status(201).send({ message: 'Se guardó el libro' });
    } catch (err) {
        return handleError(res, 'Error al guardar el libro', err);
    }
});

// Save author
router.post('/autor', async (req, res) => {
    const { save } = req.body;
    const verifi = 'SELECT id_au FROM usuario_autor WHERE id_autor = ? AND id_usuario = ?';

    try {
        const [result] = await conex.execute(verifi, [save.id_autor, save.id_usuario]);

        if (result.length > 0) return handleError(res, 'El autor ya está guardado', null, 409);

        const query = 'INSERT INTO usuario_autor(id_autor, id_usuario) VALUES(?, ?)';
        await conex.execute(query, [save.id_autor, save.id_usuario]);

        res.status(201).send({ message: 'Se guardó el autor como favorito' });
    } catch (err) {
        return handleError(res, 'Error al guardar el autor favorito', err);
    }
});

// Save category
router.post('/categoria', async (req, res) => {
    const { save } = req.body;
    const verifi = 'SELECT id_uc FROM usuario_categoria WHERE id_categoria = ? AND id_usuario = ?';

    try {
        const [result] = await conex.execute(verifi, [save.id_categoria, save.id_usuario]);

        if (result.length > 0) return handleError(res, 'La categoría ya está guardada', null, 409);

        const query = `INSERT INTO usuario_categoria(id_categoria, id_usuario) VALUES(?, ?)`;
        await conex.execute(query, [save.id_categoria, save.id_usuario]);

        res.status(201).send({ message: 'Se guardó la categoría como favorita' });
    } catch (err) {
        return handleError(res, 'Error al guardar la categoría favorita', err);
    }
});

module.exports = router;