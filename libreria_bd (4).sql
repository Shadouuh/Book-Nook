-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-10-2024 a las 20:04:21
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
  `fecha_nacimiento` date DEFAULT NULL,
  `pais_origen` varchar(50) DEFAULT NULL,
  `biografia` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `autores`
--

INSERT INTO `autores` (`id_autor`, `nombre`, `fecha_nacimiento`, `pais_origen`, `biografia`) VALUES
(1, 'Martin Kohan', '1967-01-24', 'Argentina', 'Escritor, crítico literario y docente. Licenciado y Doctor en Letras por la Universidad de Buenos Aires.'),
(2, 'Edgar Allan Poe', '1809-01-19', 'Estados unidos', 'Edgar Allan Poe fue un escritor, poeta, crítico y periodista romántico​​ estadounidense, generalmente reconocido como uno de los maestros universales del relato corto, del cual fue uno de los primeros practicantes en su país. Fue renovador de la novela gótica, recordado especialmente por sus cuentos de terror.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL,
  `es_actual` tinyint(1) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id_carrito`, `es_actual`, `id_usuario`) VALUES
(1, 1, 1),
(2, 1, 9),
(3, 0, 2),
(4, 0, 2),
(5, 1, 11),
(7, 1, 14),
(8, 1, 18),
(9, 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_items`
--

CREATE TABLE `carrito_items` (
  `id_item` int(11) NOT NULL,
  `id_carrito` int(11) DEFAULT NULL,
  `id_libro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `carrito_items`
--

INSERT INTO `carrito_items` (`id_item`, `id_carrito`, `id_libro`) VALUES
(2, 1, 3),
(3, 1, 1),
(5, 1, 1),
(6, 1, 1);

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
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id_empleado` int(11) NOT NULL,
  `dni` varchar(15) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `area` varchar(50) DEFAULT NULL,
  `id_sede` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id_empleado`, `dni`, `nombre`, `apellido`, `area`, `id_sede`) VALUES
(1, '47232321', 'Ezequiel', 'Enrriquez', 'Reparto', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encargados`
--

CREATE TABLE `encargados` (
  `id_encargado` int(11) NOT NULL,
  `dni` varchar(15) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `area` varchar(50) DEFAULT NULL,
  `id_sede` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `id_libro` int(11) NOT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `clasificacion` enum('Todos','+3','+7','+12','+16','+18') DEFAULT NULL,
  `num_paginas` int(11) DEFAULT NULL,
  `precio` float NOT NULL,
  `stock` int(11) NOT NULL,
  `es_fisico` tinyint(1) NOT NULL,
  `año_publicacion` year(4) NOT NULL,
  `id_editorial` int(11) DEFAULT NULL,
  `id_autor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id_libro`, `titulo`, `descripcion`, `clasificacion`, `num_paginas`, `precio`, `stock`, `es_fisico`, `año_publicacion`, `id_editorial`, `id_autor`) VALUES
(1, 'Dos veces junio', 'Durante la epoca de la dictatura y el mundial, Argentina paso por todo', NULL, NULL, 110000, 11, 1, '2002', 1, 1),
(3, 'Fahrenheit 451', 'Una novela utópica en donde se prohiben los libros en la sociedad', NULL, NULL, 14000, 23, 1, '1953', 1, 1),
(8, 'libro real', 'mas real que las mujeres', '+18', 1, 3000, 21, 1, '2002', 1, 1);

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
(2, 3, 3),
(3, 8, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_clave`
--

CREATE TABLE `libro_clave` (
  `id_clave` int(11) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `id_libro` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `libro_clave`
--

INSERT INTO `libro_clave` (`id_clave`, `token`, `id_libro`, `id_usuario`) VALUES
(2, 'kdsnflkdsnfnsdknfsdlkfksdfknsdkfdsfnlksnkfnlksnflsnlknflknslkfn', 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_imgs`
--

CREATE TABLE `libro_imgs` (
  `id_libro_img` int(11) NOT NULL,
  `archivo` varchar(255) DEFAULT NULL,
  `tipo_angulo` enum('adelante','atras','adentro') DEFAULT NULL,
  `id_libro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `libro_imgs`
--

INSERT INTO `libro_imgs` (`id_libro_img`, `archivo`, `tipo_angulo`, `id_libro`) VALUES
(1, 'santi.png', 'adelante', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `login`
--

CREATE TABLE `login` (
  `id_login` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `clave` varchar(256) DEFAULT NULL,
  `tipo` enum('super_admin','cliente','encargado','empleado','repatidor') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `login`
--

INSERT INTO `login` (`id_login`, `email`, `telefono`, `clave`, `tipo`) VALUES
(1, 'juancottier0@gmail.com', '', '1234', 'super_admin'),
(9, 'juanescolar0@gmail.com', 'undefined', 'dd9LJ2akb70yF4sZX849l2MmZd9CX3exYf3Kv6Dssq6YK3frPx7yF2rHHr2Fy7xPrf3KY6qssD6vK3fYxe3XC9dZmM2l948XZs4Fy07bka2JL9dd', 'cliente'),
(10, 'palateo8567@gmail.com', NULL, 'i79yU4dZb809F2smid9CU3dxVD1vC3oYHs2Fy0xbOb6vv6bObx0yF2sHYo3Cv1DVxd3UC9dims2F908bZd4Uy97i', 'cliente'),
(11, 'teresita@gmail.com', '113254769801', 'Vd1CC3oxH829y2xmQ75yc4zZnk2jT7sFPe7XF9rZZM9lX4eXsf6KK6fsPr7FF7rPsf6KK6fsXe4Xl9MZZr9FX7ePFs7Tj2knZz4cy57Qmx2y928Hxo3CC1dV', 'cliente'),
(33, 'correo@gmail.com', '', '1234', 'empleado'),
(56, 'santelo@hotmail.com', '1111111111', 'Vd1CC3oxH829y2xmQ75yc4zZnk2jT7sFPe7XF9rZZM9lX4eXsf6KK6fsPr7FF7rPsf6KK6fsXe4Xl9MZZr9FX7ePFs7Tj2knZz4cy57Qmx2y928Hxo3CC1dV', 'cliente'),
(57, 'nodejs.com', '1234567890', 'iL9vU3dNs26QK8fjVk1jC7oFse6XK9fZVM1lC4oXsf6KK6fsgr4FM7zPHx2yy2xHPz7MF4rgsf6KK6fsXo4Cl1MVZf9KX6esFo7Cj1kVjf8KQ62sNd3Uv9Li', 'cliente'),
(59, 'phppythonnodejs.com', '0987654321', 'iL9vU3dNs26QK8fjVk1jC7oFse6XK9fZVM1lC4oXsf6KK6fsgr4FM7zPHx2yy2xHPz7MF4rgsf6KK6fsXo4Cl1MVZf9KX6esFo7Cj1kVjf8KQ62sNd3Uv9Li', 'cliente'),
(60, 'email.com', '0101010101', 'dd9LJ2akb70yF4sZX849l2MmZd9CX3exYf3Kv6DssD6vK3fYxe3XC9dZmM2l948XZs4Fy07bka2JL9dd', 'cliente'),
(62, 'blablaemail.com', '11110000', 'dd9LJ2akb70yF4sZX849l2MmZd9CX3exYf3Kv6DssD6vK3fYxe3XC9dZmM2l948XZs4Fy07bka2JL9dd', 'cliente'),
(68, 'mail.com.ar', '1123581347', 'dd9LJ2akb70yF4sZX849l2MmZd9CX3exYf3Kv6DssD6vK3fYxe3XC9dZmM2l948XZs4Fy07bka2JL9dd', 'cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mentores`
--

CREATE TABLE `mentores` (
  `id_mentor` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `mentores`
--

INSERT INTO `mentores` (`id_mentor`, `nombre`, `apellido`) VALUES
(1, 'Cottier', 'Juan');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mentor_frase`
--

CREATE TABLE `mentor_frase` (
  `id_mf` int(11) NOT NULL,
  `frase` text DEFAULT NULL,
  `id_mentor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `mentor_frase`
--

INSERT INTO `mentor_frase` (`id_mf`, `frase`, `id_mentor`) VALUES
(1, 'A veces la vida es la vida y aveces la mama de santi...', 1),
(2, 'El tonto, programa en python, el habil, en php y el inteligente en node', 1);

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
  `fecha_compra` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) DEFAULT NULL,
  `id_carrito` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `total`, `estado`, `fecha_estimada`, `fecha_llegada`, `fecha_compra`, `id_usuario`, `id_carrito`) VALUES
(1, 18000, 'pendiente', '2024-10-04', '0000-00-00', '2024-09-30 03:00:00', 1, 1),
(3, 3000, 'pendiente', '2025-05-05', '0000-00-00', '2024-10-17 15:33:46', 2, 3),
(4, 12345, 'pendiente', '2001-01-01', '0000-00-00', '2024-10-18 13:39:53', 2, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sedes`
--

CREATE TABLE `sedes` (
  `id_sede` int(11) NOT NULL,
  `localidad` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `sedes`
--

INSERT INTO `sedes` (`id_sede`, `localidad`) VALUES
(1, 'Monte Grande'),
(2, 'Caballito');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_nacimiento` date DEFAULT NULL,
  `alias` varchar(50) DEFAULT NULL,
  `id_login` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `direccion`, `fecha_registro`, `fecha_nacimiento`, `alias`, `id_login`) VALUES
(1, 'Cuan', 'Gottier', 'Miranda 895', '2024-09-29 03:00:00', '2007-09-04', 'Juanerros', 1),
(2, 'Don', 'Roberto', 'Los Pinos 343', '2024-10-17 13:29:15', '2002-01-01', 'Yadou', 56),
(9, 'Juan', 'Juan', 'Acanomas 321', '2024-10-17 14:22:29', '2001-11-01', 'Juanarroz', 57),
(11, 'Juan', 'Juan', 'Acanomas 321', '2024-10-17 20:06:58', '2001-11-01', 'Nauj', 59),
(14, 'Cottier', 'Juan', 'casa 123', '2024-10-17 20:12:34', '2024-11-01', 'Evil Juan', 62),
(18, 'Cottier', 'Juan', 'casa 123', '2024-10-17 20:39:19', '2024-11-01', 'aña Juan', 68);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_autor`
--

CREATE TABLE `usuario_autor` (
  `id_au` int(11) NOT NULL,
  `id_autor` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario_autor`
--

INSERT INTO `usuario_autor` (`id_au`, `id_autor`, `id_usuario`) VALUES
(1, 1, 1),
(2, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_categoria`
--

CREATE TABLE `usuario_categoria` (
  `id_uc` int(11) NOT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario_categoria`
--

INSERT INTO `usuario_categoria` (`id_uc`, `id_categoria`, `id_usuario`) VALUES
(1, 1, 1),
(2, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_libro`
--

CREATE TABLE `usuario_libro` (
  `id_ul` int(11) NOT NULL,
  `estado_lectura` enum('leyendo','terminado','abandonado','no empezado','no posee') DEFAULT NULL,
  `id_libro` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario_libro`
--

INSERT INTO `usuario_libro` (`id_ul`, `estado_lectura`, `id_libro`, `id_usuario`) VALUES
(5, NULL, 3, 1),
(16, NULL, 1, 1);

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
-- Indices de la tabla `editoriales`
--
ALTER TABLE `editoriales`
  ADD PRIMARY KEY (`id_editorial`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id_empleado`),
  ADD KEY `id_sede` (`id_sede`);

--
-- Indices de la tabla `encargados`
--
ALTER TABLE `encargados`
  ADD PRIMARY KEY (`id_encargado`),
  ADD KEY `id_sede` (`id_sede`);

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id_libro`),
  ADD KEY `id_editorial` (`id_editorial`),
  ADD KEY `id_autor` (`id_autor`);

--
-- Indices de la tabla `libro_categoria`
--
ALTER TABLE `libro_categoria`
  ADD PRIMARY KEY (`id_lc`),
  ADD KEY `id_libro` (`id_libro`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `libro_clave`
--
ALTER TABLE `libro_clave`
  ADD PRIMARY KEY (`id_clave`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_libro` (`id_libro`);

--
-- Indices de la tabla `libro_imgs`
--
ALTER TABLE `libro_imgs`
  ADD PRIMARY KEY (`id_libro_img`),
  ADD KEY `id_libro` (`id_libro`);

--
-- Indices de la tabla `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id_login`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `mentores`
--
ALTER TABLE `mentores`
  ADD PRIMARY KEY (`id_mentor`);

--
-- Indices de la tabla `mentor_frase`
--
ALTER TABLE `mentor_frase`
  ADD PRIMARY KEY (`id_mf`),
  ADD KEY `id_mentor` (`id_mentor`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`,`id_carrito`),
  ADD KEY `id_carrito` (`id_carrito`);

--
-- Indices de la tabla `sedes`
--
ALTER TABLE `sedes`
  ADD PRIMARY KEY (`id_sede`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `alias` (`alias`),
  ADD KEY `id_login` (`id_login`);

--
-- Indices de la tabla `usuario_autor`
--
ALTER TABLE `usuario_autor`
  ADD PRIMARY KEY (`id_au`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`,`id_autor`),
  ADD KEY `id_autor` (`id_autor`);

--
-- Indices de la tabla `usuario_categoria`
--
ALTER TABLE `usuario_categoria`
  ADD PRIMARY KEY (`id_uc`),
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
  MODIFY `id_autor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `carrito_items`
--
ALTER TABLE `carrito_items`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `editoriales`
--
ALTER TABLE `editoriales`
  MODIFY `id_editorial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id_empleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `encargados`
--
ALTER TABLE `encargados`
  MODIFY `id_encargado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `id_libro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `libro_categoria`
--
ALTER TABLE `libro_categoria`
  MODIFY `id_lc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `libro_clave`
--
ALTER TABLE `libro_clave`
  MODIFY `id_clave` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `libro_imgs`
--
ALTER TABLE `libro_imgs`
  MODIFY `id_libro_img` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `login`
--
ALTER TABLE `login`
  MODIFY `id_login` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT de la tabla `mentores`
--
ALTER TABLE `mentores`
  MODIFY `id_mentor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `mentor_frase`
--
ALTER TABLE `mentor_frase`
  MODIFY `id_mf` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `sedes`
--
ALTER TABLE `sedes`
  MODIFY `id_sede` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `usuario_autor`
--
ALTER TABLE `usuario_autor`
  MODIFY `id_au` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario_categoria`
--
ALTER TABLE `usuario_categoria`
  MODIFY `id_uc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario_libro`
--
ALTER TABLE `usuario_libro`
  MODIFY `id_ul` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

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
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`id_sede`) REFERENCES `sedes` (`id_sede`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `encargados`
--
ALTER TABLE `encargados`
  ADD CONSTRAINT `encargados_ibfk_1` FOREIGN KEY (`id_sede`) REFERENCES `sedes` (`id_sede`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `libros`
--
ALTER TABLE `libros`
  ADD CONSTRAINT `libros_ibfk_1` FOREIGN KEY (`id_editorial`) REFERENCES `editoriales` (`id_editorial`) ON DELETE CASCADE,
  ADD CONSTRAINT `libros_ibfk_2` FOREIGN KEY (`id_autor`) REFERENCES `autores` (`id_autor`) ON DELETE CASCADE;

--
-- Filtros para la tabla `libro_categoria`
--
ALTER TABLE `libro_categoria`
  ADD CONSTRAINT `libro_categoria_ibfk_1` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`) ON DELETE CASCADE,
  ADD CONSTRAINT `libro_categoria_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE;

--
-- Filtros para la tabla `libro_clave`
--
ALTER TABLE `libro_clave`
  ADD CONSTRAINT `libro_clave_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `libro_clave_ibfk_2` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`) ON DELETE CASCADE;

--
-- Filtros para la tabla `libro_imgs`
--
ALTER TABLE `libro_imgs`
  ADD CONSTRAINT `libro_imgs_ibfk_1` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mentor_frase`
--
ALTER TABLE `mentor_frase`
  ADD CONSTRAINT `mentor_frase_ibfk_1` FOREIGN KEY (`id_mentor`) REFERENCES `mentores` (`id_mentor`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_login`) REFERENCES `login` (`id_login`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario_autor`
--
ALTER TABLE `usuario_autor`
  ADD CONSTRAINT `usuario_autor_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_autor_ibfk_2` FOREIGN KEY (`id_autor`) REFERENCES `autores` (`id_autor`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_categoria`
--
ALTER TABLE `usuario_categoria`
  ADD CONSTRAINT `usuario_categoria_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_categoria_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE;

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
