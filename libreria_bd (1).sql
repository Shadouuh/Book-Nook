-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-10-2024 a las 21:07:04
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `libreria_bd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autores`
--

CREATE TABLE `autores` (
  `id_autor` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `pais_origen` varchar(50) DEFAULT NULL,
  `biografia` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `autores`
--

INSERT INTO `autores` (`id_autor`, `nombre`, `apellido`, `fecha_nacimiento`, `pais_origen`, `biografia`) VALUES
(1, 'Martin', 'Kohan', '1967-01-24', 'Argentina', 'Escritor, crítico literario y docente. Licenciado y Doctor en Letras por la Universidad de Buenos Aires.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id_carrito`, `id_usuario`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_items`
--

CREATE TABLE `carrito_items` (
  `id_item` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `id_carrito` int(11) DEFAULT NULL,
  `id_libro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `carrito_items`
--

INSERT INTO `carrito_items` (`id_item`, `cantidad`, `id_carrito`, `id_libro`) VALUES
(2, 1, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`) VALUES
(1, 'ciencia ficción'),
(2, 'realista'),
(3, 'utopia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clave_libro`
--

CREATE TABLE `clave_libro` (
  `id_clave` int(11) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `id_libro` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `editoriales`
--

CREATE TABLE `editoriales` (
  `id_editorial` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `editoriales`
--

INSERT INTO `editoriales` (`id_editorial`, `nombre`) VALUES
(1, 'De bolsillo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `id_libro` int(11) NOT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` float NOT NULL,
  `stock` int(11) NOT NULL,
  `es_fisico` tinyint(1) NOT NULL,
  `fecha_publicacion` date NOT NULL,
  `id_editorial` int(11) DEFAULT NULL,
  `id_autor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id_libro`, `titulo`, `descripcion`, `precio`, `stock`, `es_fisico`, `fecha_publicacion`, `id_editorial`, `id_autor`) VALUES
(1, 'Dos veces junio', 'Durante la epoca de la dictatura y el mundial, Argentina paso por todo', 110000, 12, 1, '2002-01-01', 1, 1),
(3, 'Fahrenheit 451', 'Una novela utópica en donde se prohiben los libros en la sociedad', 14000, 23, 1, '1953-10-19', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros_imgs`
--

CREATE TABLE `libros_imgs` (
  `id_libro_img` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `tipo_angulo` enum('adelante','atras','adentro') DEFAULT NULL,
  `id_libro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_categoria`
--

CREATE TABLE `libro_categoria` (
  `id_lc` int(11) NOT NULL,
  `id_libro` int(11) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `libro_categoria`
--

INSERT INTO `libro_categoria` (`id_lc`, `id_libro`, `id_categoria`) VALUES
(1, 3, 1),
(2, 3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `login`
--

CREATE TABLE `login` (
  `id_login` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `clave` varchar(50) DEFAULT NULL,
  `tipo` enum('super_admin','cliente','encargado','empleado','repatidor','invitado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `login`
--

INSERT INTO `login` (`id_login`, `email`, `telefono`, `clave`, `tipo`) VALUES
(1, 'juancottier0@gmail.com', '115655654', '1234', 'super_admin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `total` float DEFAULT NULL,
  `estado` enum('pendiente','entregado','cancelado') NOT NULL,
  `fecha_estimada` date NOT NULL,
  `fecha_llegada` date NOT NULL,
  `fecha_compra` date DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_carrito` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `total`, `estado`, `fecha_estimada`, `fecha_llegada`, `fecha_compra`, `id_usuario`, `id_carrito`) VALUES
(1, 18000, 'pendiente', '2024-10-04', '0000-00-00', '2024-09-30', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `alias` varchar(50) DEFAULT NULL,
  `id_login` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `direccion`, `fecha_registro`, `fecha_nacimiento`, `alias`, `id_login`) VALUES
(1, 'Cuan', 'Gottier', 'Miranda 895', '2024-09-29', '2007-09-04', 'Juanerros', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_autor_favorito`
--

CREATE TABLE `usuario_autor_favorito` (
  `id_uaf` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_autor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario_autor_favorito`
--

INSERT INTO `usuario_autor_favorito` (`id_uaf`, `id_usuario`, `id_autor`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_categoria_favorita`
--

CREATE TABLE `usuario_categoria_favorita` (
  `id_usf` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario_categoria_favorita`
--

INSERT INTO `usuario_categoria_favorita` (`id_usf`, `id_usuario`, `id_categoria`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_libro`
--

CREATE TABLE `usuario_libro` (
  `id_ul` int(11) NOT NULL,
  `estado_lectura` enum('leyendo','terminado','abandonado','no empezado','no posee') DEFAULT NULL,
  `es_favorito` tinyint(1) NOT NULL,
  `id_libro` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario_libro`
--

INSERT INTO `usuario_libro` (`id_ul`, `estado_lectura`, `es_favorito`, `id_libro`, `id_usuario`) VALUES
(1, 'no empezado', 0, 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autores`
--
ALTER TABLE `autores`
  ADD PRIMARY KEY (`id_autor`);

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `carrito_items`
--
ALTER TABLE `carrito_items`
  ADD PRIMARY KEY (`id_item`),
  ADD KEY `id_carrito` (`id_carrito`),
  ADD KEY `id_libro` (`id_libro`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `clave_libro`
--
ALTER TABLE `clave_libro`
  ADD PRIMARY KEY (`id_clave`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_libro` (`id_libro`);

--
-- Indices de la tabla `editoriales`
--
ALTER TABLE `editoriales`
  ADD PRIMARY KEY (`id_editorial`);

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id_libro`),
  ADD KEY `id_editorial` (`id_editorial`),
  ADD KEY `id_autor` (`id_autor`);

--
-- Indices de la tabla `libros_imgs`
--
ALTER TABLE `libros_imgs`
  ADD PRIMARY KEY (`id_libro_img`),
  ADD KEY `id_libro` (`id_libro`);

--
-- Indices de la tabla `libro_categoria`
--
ALTER TABLE `libro_categoria`
  ADD PRIMARY KEY (`id_lc`),
  ADD KEY `id_libro` (`id_libro`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id_login`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `telefono` (`telefono`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `id_login` (`id_login`);

--
-- Indices de la tabla `usuario_autor_favorito`
--
ALTER TABLE `usuario_autor_favorito`
  ADD PRIMARY KEY (`id_uaf`);

--
-- Indices de la tabla `usuario_categoria_favorita`
--
ALTER TABLE `usuario_categoria_favorita`
  ADD PRIMARY KEY (`id_usf`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `usuario_libro`
--
ALTER TABLE `usuario_libro`
  ADD PRIMARY KEY (`id_ul`),
  ADD KEY `id_libro` (`id_libro`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `autores`
--
ALTER TABLE `autores`
  MODIFY `id_autor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `carrito_items`
--
ALTER TABLE `carrito_items`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `clave_libro`
--
ALTER TABLE `clave_libro`
  MODIFY `id_clave` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `editoriales`
--
ALTER TABLE `editoriales`
  MODIFY `id_editorial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `id_libro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `libros_imgs`
--
ALTER TABLE `libros_imgs`
  MODIFY `id_libro_img` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `libro_categoria`
--
ALTER TABLE `libro_categoria`
  MODIFY `id_lc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `login`
--
ALTER TABLE `login`
  MODIFY `id_login` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuario_autor_favorito`
--
ALTER TABLE `usuario_autor_favorito`
  MODIFY `id_uaf` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuario_categoria_favorita`
--
ALTER TABLE `usuario_categoria_favorita`
  MODIFY `id_usf` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuario_libro`
--
ALTER TABLE `usuario_libro`
  MODIFY `id_ul` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `carrito_items`
--
ALTER TABLE `carrito_items`
  ADD CONSTRAINT `carrito_items_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`) ON DELETE CASCADE,
  ADD CONSTRAINT `carrito_items_ibfk_2` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`) ON DELETE CASCADE;

--
-- Filtros para la tabla `clave_libro`
--
ALTER TABLE `clave_libro`
  ADD CONSTRAINT `clave_libro_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `clave_libro_ibfk_2` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`) ON DELETE CASCADE;

--
-- Filtros para la tabla `libros`
--
ALTER TABLE `libros`
  ADD CONSTRAINT `libros_ibfk_1` FOREIGN KEY (`id_editorial`) REFERENCES `editoriales` (`id_editorial`) ON DELETE CASCADE,
  ADD CONSTRAINT `libros_ibfk_2` FOREIGN KEY (`id_autor`) REFERENCES `autores` (`id_autor`) ON DELETE CASCADE;

--
-- Filtros para la tabla `libros_imgs`
--
ALTER TABLE `libros_imgs`
  ADD CONSTRAINT `libros_imgs_ibfk_1` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`) ON DELETE CASCADE;

--
-- Filtros para la tabla `libro_categoria`
--
ALTER TABLE `libro_categoria`
  ADD CONSTRAINT `libro_categoria_ibfk_1` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`) ON DELETE CASCADE,
  ADD CONSTRAINT `libro_categoria_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_login`) REFERENCES `login` (`id_login`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario_categoria_favorita`
--
ALTER TABLE `usuario_categoria_favorita`
  ADD CONSTRAINT `usuario_categoria_favorita_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_categoria_favorita_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario_libro`
--
ALTER TABLE `usuario_libro`
  ADD CONSTRAINT `usuario_libro_ibfk_1` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_libro_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
