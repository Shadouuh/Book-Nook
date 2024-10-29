const path = require('path');
const { router, handleError } = require(path.join(__dirname, '..', 'config', 'setup'));

const createConnection = require(path.join(__dirname, '..', 'config', 'conexBD'));

let conex;
async function init() {
    conex = await createConnection();
}

init();

//Insert into cart
router.post('/insertar', async (req, res) => {
    const { cart } = req.body;

    try {
        const [resultCart] = await conex.execute(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? ORDER BY id_carrito DESC',
            [cart.id_usuario]
        )

        if (resultCart.length == 0) return handleError(res, 'Error al obtener el id_carrito', null, 404);

        const [resultBook] = await conex.query('SELECT stock FROM libros WHERE stock > 0');
        if (resultBook.length == 0) return handleError(res, 'No hay stock del libro');

        await conex.execute(
            'INSERT INTO carrito_items(id_carrito, id_libro) VALUES(?, ?)',
            [resultCart[0].id_carrito, cart.id_libro]
        );

        await conex.query(`UPDATE libros SET stock = (${resultBook[0].stock} - 1) WHERE id_libro = ${cart.id_libro}`);

        res.status(201).send({ message: 'Se guardo el item en el carrito' });

    } catch (err) {
        return handleError(res, 'Error al guardar en el carrito', err);
    }
});

//Show items
router.get('/items/ver/:id', async (req, res) => {
    const { id } = req.params;
    let resultBooks = [];

    try {
        const [resultCart] = await conex.execute(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? AND es_actual = 1',
            [id]
        )

        if (resultCart.length == 0) return handleError(res, 'No se encontro el carrito actual', null, 404);

        const [resultItems] = await conex.execute(
            'SELECT id_libro FROM carrito_items WHERE id_carrito = ?',
            [resultCart[0].id_carrito]
        );

        console.log(resultItems);

        if (resultItems.length == 0) return handleError(res, 'No se encontraron o no hay items', null, 404);

        for (const item of resultItems) {
            let book = await fetch(`http://localhost:3000/libro/ver/${item.id_libro}`);

            console.log(await book.json());



//Como chuchas se recibe en el fetch



            resultBooks.push(book.body);
        }

        res.status(200).send({ resultBooks });

    } catch (err) {
        return handleError(res, 'Hubo un error al mostrar los items del carrito', err);
    }
});

//buy
router.post('/pedir', async (req, res) => {
    const { order } = req.body;

    try {
        const [id_usuario] = await conex.execute(
            'SELECT id_usuario FROM usuarios WHERE id_usuario = ?',
            [order.id_usuario]
        );

        if (id_usuario.length == 0) return handleError(res, 'No se encontro al usuario', null, 404);

        const [id_carrito] = await conex.execute(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? AND es_actual = true',
            [order.id_usuario]
        );

        if (id_carrito.length == 0) return handleError(res, 'No se encontro el carrito', null, 404);

        await conex.execute(
            'INSERT INTO pedidos(total, estado, fecha_estimada, id_usuario, id_carrito) VALUES(?, "pendiente", ?, ?,?)',
            [order.total, order.fecha_estimada, order.id_usuario, id_carrito[0].id_carrito]
        );

        await conex.execute(
            'INSERT INTO carrito(id_usuario, es_actual) VALUES(?, true)',
            [order.id_usuario]
        );

        await conex.execute(
            'UPDATE carrito SET es_actual = false WHERE id_carrito = ?',
            [id_carrito[0].id_carrito]
        );

        res.status(201).send({ message: 'Se pidio el carrito' });

    } catch (err) {
        return handleError(res, 'Hubo un error en el carrito', err);
    }
});

module.exports = router;
