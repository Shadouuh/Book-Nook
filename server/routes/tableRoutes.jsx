// Imports
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Table from '../../admin/src/components/Table.jsx';

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/autores" element={<Table tableName="autores" />} />
      <Route path="/carrito" element={<Table tableName="carrito" />} />
      <Route path="/carrito_items" element={<Table tableName="carrito_items" />} />
      <Route path="/categorias" element={<Table tableName="categorias" />} />
      <Route path="/clave_libro" element={<Table tableName="clave_libro" />} />
      <Route path="/editoriales" element={<Table tableName="editoriales" />} />
      <Route path="/libros" element={<Table tableName="libros" />} />
      <Route path="/libros_imgs" element={<Table tableName="libros_imgs" />} />
      <Route path="/libro_categoria" element={<Table tableName="libro_categoria" />} />
      <Route path="/login" element={<Table tableName="login" />} />
      <Route path="/pedidos" element={<Table tableName="pedidos" />} />
      <Route path="/usuarios" element={<Table tableName="usuarios" />} />
      <Route path="/usuario_autor_favorito" element={<Table tableName="usuario_autor_favorito" />} />
      <Route path="/usuario_categoria_favorita" element={<Table tableName="usuario_categoria_favorita" />} />
      <Route path="/usuario_libro" element={<Table tableName="usuario_libro" />} />
    </Routes>
  );
};

export default RoutesConfig