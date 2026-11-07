-- =====================================================================
-- TecnoStore - Script de la base de datos
-- Crea las tablas de la tienda en el schema "parcial" y carga los 8
-- productos del catalogo. Se puede volver a ejecutar: borra las tablas
-- y las crea de nuevo (OJO: se pierden los pedidos y mensajes guardados).
-- =====================================================================

CREATE DATABASE IF NOT EXISTS parcial
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE parcial;

-- Se borran en orden inverso: primero las tablas que dependen de otras.
DROP TABLE IF EXISTS pedido_detalle;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS especificaciones;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS mensajes_contacto;


-- ---------------------------------------------------------------------
-- Categorias del catalogo (Portatiles, Perifericos, ...)
-- ---------------------------------------------------------------------
CREATE TABLE categorias (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  nombre  VARCHAR(50) NOT NULL UNIQUE
) ENGINE = InnoDB;


-- ---------------------------------------------------------------------
-- Productos propios de la tienda. El precio se guarda en pesos
-- colombianos (COP), igual que en productos.js.
-- ---------------------------------------------------------------------
CREATE TABLE productos (
  codigo        INT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  categoria_id  INT NOT NULL,
  marca         VARCHAR(60) NOT NULL,
  precio        INT UNSIGNED NOT NULL,
  disponible    BOOLEAN NOT NULL DEFAULT TRUE,
  envio_gratis  BOOLEAN NOT NULL DEFAULT FALSE,
  descripcion   VARCHAR(255) NOT NULL,
  imagen        VARCHAR(255) NULL,
  CONSTRAINT fk_productos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
) ENGINE = InnoDB;


-- ---------------------------------------------------------------------
-- Especificaciones tecnicas. Cada producto tiene varias filas
-- atributo / valor (en productos.js es el sub-objeto "especificaciones").
-- ---------------------------------------------------------------------
CREATE TABLE especificaciones (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  producto_codigo  INT NOT NULL,
  atributo         VARCHAR(50) NOT NULL,
  valor            VARCHAR(120) NOT NULL,
  CONSTRAINT fk_especificaciones_producto
    FOREIGN KEY (producto_codigo) REFERENCES productos (codigo)
    ON DELETE CASCADE,
  CONSTRAINT uq_especificacion UNIQUE (producto_codigo, atributo)
) ENGINE = InnoDB;


-- ---------------------------------------------------------------------
-- Pedidos confirmados (datos del formulario de compra).
-- ---------------------------------------------------------------------
CREATE TABLE pedidos (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  numero           INT NOT NULL,
  fecha            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cliente_nombre   VARCHAR(120) NOT NULL,
  cliente_email    VARCHAR(120) NOT NULL,
  cliente_telefono CHAR(10) NOT NULL,
  direccion        VARCHAR(200) NOT NULL,
  ciudad           VARCHAR(60) NOT NULL,
  metodo_pago      VARCHAR(20) NOT NULL,
  total            INT UNSIGNED NOT NULL,
  CONSTRAINT ck_pedidos_metodo_pago
    CHECK (metodo_pago IN ('tarjeta', 'pse', 'contraentrega'))
) ENGINE = InnoDB;


-- ---------------------------------------------------------------------
-- Productos de cada pedido. No tiene llave foranea hacia "productos"
-- porque al carrito tambien entran productos de "Novedades en linea"
-- (codigo 1000 en adelante), que no estan en nuestra tabla. Por eso se
-- copian el nombre, la imagen y el precio del momento de la compra.
-- ---------------------------------------------------------------------
CREATE TABLE pedido_detalle (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id        INT NOT NULL,
  producto_codigo  INT NOT NULL,
  nombre           VARCHAR(120) NOT NULL,
  imagen           VARCHAR(255) NULL,
  precio_unitario  INT UNSIGNED NOT NULL,
  cantidad         TINYINT UNSIGNED NOT NULL,
  CONSTRAINT fk_detalle_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id)
    ON DELETE CASCADE,
  CONSTRAINT ck_detalle_cantidad CHECK (cantidad BETWEEN 1 AND 10)
) ENGINE = InnoDB;


-- ---------------------------------------------------------------------
-- Mensajes enviados desde el formulario de contacto.
-- ---------------------------------------------------------------------
CREATE TABLE mensajes_contacto (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(120) NOT NULL,
  email    VARCHAR(120) NOT NULL,
  asunto   VARCHAR(60) NOT NULL,
  mensaje  VARCHAR(300) NOT NULL,
  fecha    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;


-- =====================================================================
-- Datos iniciales: los mismos de src/datos/productos.js
-- =====================================================================

INSERT INTO categorias (id, nombre) VALUES
  (1, 'Portatiles'),
  (2, 'Perifericos'),
  (3, 'Componentes'),
  (4, 'Monitores');

INSERT INTO productos
  (codigo, nombre, categoria_id, marca, precio, disponible, envio_gratis, descripcion, imagen)
VALUES
  (1, 'Portatil Lenovo IdeaPad 3',        1, 'Lenovo',   2450000, TRUE,  TRUE,  'Equipo liviano para estudio y ofimatica, con arranque rapido en SSD.', 'portatil-lenovo.svg'),
  (2, 'Portatil ASUS TUF Gaming A15',     1, 'ASUS',     4890000, TRUE,  TRUE,  'Portatil gamer con refrigeracion reforzada y pantalla de 144 Hz.',      'portatil-asus.svg'),
  (3, 'Teclado mecanico Redragon Kumara', 2, 'Redragon',  185000, TRUE,  FALSE, 'Teclado mecanico compacto con switches azules y retroiluminacion.',     'teclado-redragon.svg'),
  (4, 'Mouse inalambrico Logitech M720',  2, 'Logitech',  210000, TRUE,  FALSE, 'Mouse multidispositivo que cambia entre tres equipos con un boton.',    'mouse-logitech.svg'),
  (5, 'Memoria RAM Kingston Fury 16 GB',  3, 'Kingston',  320000, TRUE,  FALSE, 'Modulo DDR4 para ampliar el rendimiento en tareas pesadas.',            'ram-kingston.svg'),
  (6, 'Disco solido Samsung 980 1 TB',    3, 'Samsung',   415000, FALSE, TRUE,  'Unidad NVMe que reduce los tiempos de carga del sistema operativo.',    'ssd-samsung.svg'),
  (7, 'Monitor LG UltraGear 24"',         4, 'LG',        890000, TRUE,  TRUE,  'Monitor de 144 Hz con tiempo de respuesta de 1 ms.',                    'monitor-lg.svg'),
  (8, 'Monitor Samsung ViewFinity 27"',   4, 'Samsung',  1290000, TRUE,  TRUE,  'Panel IPS con alta fidelidad de color para diseno y programacion.',     'monitor-samsung.svg');

INSERT INTO especificaciones (producto_codigo, atributo, valor) VALUES
  (1, 'procesador',     'Intel Core i5 de 12va generacion'),
  (1, 'memoria',        '16 GB RAM'),
  (1, 'almacenamiento', 'SSD 512 GB'),
  (1, 'garantia',       '12 meses'),

  (2, 'procesador',     'AMD Ryzen 7'),
  (2, 'memoria',        '16 GB RAM'),
  (2, 'almacenamiento', 'SSD 1 TB'),
  (2, 'garantia',       '24 meses'),

  (3, 'tipo',           'Mecanico TKL'),
  (3, 'conexion',       'USB cableado'),
  (3, 'switches',       'Outemu azul'),
  (3, 'garantia',       '6 meses'),

  (4, 'tipo',           'Ergonomico'),
  (4, 'conexion',       'Bluetooth y receptor USB'),
  (4, 'bateria',        'Hasta 24 meses'),
  (4, 'garantia',       '12 meses'),

  (5, 'capacidad',      '16 GB'),
  (5, 'tecnologia',     'DDR4 3200 MHz'),
  (5, 'formato',        'DIMM escritorio'),
  (5, 'garantia',       'De por vida'),

  (6, 'capacidad',      '1 TB'),
  (6, 'interfaz',       'NVMe PCIe 3.0'),
  (6, 'lectura',        '3500 MB/s'),
  (6, 'garantia',       '60 meses'),

  (7, 'tamano',         '24 pulgadas'),
  (7, 'resolucion',     '1920 x 1080'),
  (7, 'frecuencia',     '144 Hz'),
  (7, 'garantia',       '36 meses'),

  (8, 'tamano',         '27 pulgadas'),
  (8, 'resolucion',     '2560 x 1440'),
  (8, 'frecuencia',     '75 Hz'),
  (8, 'garantia',       '24 meses');


-- Consulta de comprobacion: deberia mostrar 8 productos con 4
-- especificaciones cada uno.
SELECT p.codigo, p.nombre, c.nombre AS categoria, COUNT(e.id) AS especificaciones
FROM productos p
JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN especificaciones e ON e.producto_codigo = p.codigo
GROUP BY p.codigo, p.nombre, c.nombre
ORDER BY p.codigo;
