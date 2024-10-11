# BookNook

## Scripts (Console):
**npm run dev**: Prende el server de NodeJS
**npm run client**: Prende el server de Vite


## -> API <- ##

*LOGIN*
**POST** /login
**Devuelve:** un json con el id_login y el tipo de usuario

*Register*
**POST** /register
**Devuelve:** un masanje de confimacion

*SELECT BY ID*
**GET** /api/:tabla/:id
**Devuelve:** un json con los resultados mediante la llave primaria ${:id} de la ${:tabla} seleccionada


*_CRUD_*

*SHOW*
**GET** /api/:tabla
**Devuelve:** un json con todos los datos de la ${:tabla} seleccionada 

*INSERT*
**POST** /api/:tabla
**Devuelve:** un json con un mensaje de confirmacion de la insercion de la ${:tabla} seleccionada

*EDIT*
**PUT** /api/:tabla/:id
**Devuelve:** un mensaje de confimacion en donde se especifica el ${:id} del elemento actualizado de la ${:tabla}

*DELETE*
**DELETE** /api/:tabla/:id
**Devuelve:** un mensaje de confimacion en donde se el ${:id} especifica del elemento eliminado de la ${:tabla}

### HAY UN PROBLEMA CON EL LOGIN
el telefono no puede repetirse, pero si el usuario no quiere poner telefono entonces quedara como 'null' pero si ya otro usuario ya tienen 'null' en su telefono entonces se repite, asi que en la base de datos no puede ser 'unique'