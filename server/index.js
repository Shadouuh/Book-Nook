// Dependencias
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.port || 5000; 

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Configuracion para recibir Archivos (HTML, CSS, imagenes, etc)
app.use(express.static(path.join(__dirname, '../client/public')));

// Cualquier ruta que no coincida '*', devuelve el index al usuario.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

// Prender el Server
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});