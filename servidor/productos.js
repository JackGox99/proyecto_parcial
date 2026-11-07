const express = require('express');
const conexion = require('./conexion');

// ----- CRUD de productos -----
// Qué hace: agrupa las rutas de /api/productos. Cada verbo HTTP es una letra
// del CRUD: POST crea, GET lee, PUT actualiza y DELETE elimina.
const rutas = express.Router();

// Consulta base: trae cada producto con el nombre de su categoría.
const CONSULTA_PRODUCTOS = `
  SELECT p.codigo, p.nombre, p.categoria_id, c.nombre AS categoria, p.marca,
         p.precio, p.disponible, p.envio_gratis, p.descripcion, p.imagen
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id`;

// ----- Función -----
// Qué hace: convierte una fila de MySQL a la misma forma que tienen los
// productos en React (camelCase, booleanos y especificaciones como objeto).
function armarProducto(fila, especificaciones) {
  const propias = {};
  especificaciones
    .filter((espec) => espec.producto_codigo === fila.codigo)
    .forEach((espec) => {
      propias[espec.atributo] = espec.valor;
    });

  return {
    codigo: fila.codigo,
    nombre: fila.nombre,
    categoriaId: fila.categoria_id,
    categoria: fila.categoria,
    marca: fila.marca,
    precio: fila.precio,
    // MySQL guarda los BOOLEAN como 0 y 1.
    disponible: Boolean(fila.disponible),
    envioGratis: Boolean(fila.envio_gratis),
    descripcion: fila.descripcion,
    imagen: fila.imagen,
    especificaciones: propias,
  };
}

// ----- Validaciones -----
// Qué hace: revisa los datos que llegan del formulario. Devuelve un mensaje
// con el primer problema que encuentre, o una cadena vacía si todo está bien.
// React también valida, pero el servidor no puede confiar en eso.
function validar(datos) {
  if (!datos.nombre || datos.nombre.trim().length < 3) {
    return 'El nombre debe tener al menos 3 caracteres.';
  }
  if (!datos.marca || !datos.marca.trim()) {
    return 'La marca es obligatoria.';
  }
  if (!Number.isInteger(datos.categoriaId)) {
    return 'Selecciona una categoria.';
  }
  if (!Number.isInteger(datos.precio) || datos.precio <= 0) {
    return 'El precio debe ser un numero entero mayor que cero.';
  }
  if (!datos.descripcion || datos.descripcion.trim().length < 10) {
    return 'La descripcion debe tener al menos 10 caracteres.';
  }
  return '';
}

// ----- Función -----
// Qué hace: borra las especificaciones de un producto y guarda las nuevas.
// Recibe la conexión de la transacción para que todo quede en una sola
// operación: si algo falla, no queda el producto a medias.
async function guardarEspecificaciones(transaccion, codigo, especificaciones) {
  await transaccion.query('DELETE FROM especificaciones WHERE producto_codigo = ?', [codigo]);

  const filas = Object.entries(especificaciones || {})
    .filter(([atributo, valor]) => atributo.trim() && String(valor).trim())
    .map(([atributo, valor]) => [codigo, atributo.trim(), String(valor).trim()]);

  if (filas.length > 0) {
    await transaccion.query(
      'INSERT INTO especificaciones (producto_codigo, atributo, valor) VALUES ?',
      [filas]
    );
  }
}

// ----- Leer (R) -----
// Qué hace: devuelve todas las categorías, para el selector del formulario.
rutas.get('/categorias', async (peticion, respuesta) => {
  const [filas] = await conexion.query('SELECT id, nombre FROM categorias ORDER BY nombre');
  respuesta.json(filas);
});

// ----- Leer (R) -----
// Qué hace: devuelve la lista completa de productos.
rutas.get('/productos', async (peticion, respuesta) => {
  const [filas] = await conexion.query(CONSULTA_PRODUCTOS + ' ORDER BY p.codigo');
  const [especificaciones] = await conexion.query('SELECT * FROM especificaciones ORDER BY id');
  respuesta.json(filas.map((fila) => armarProducto(fila, especificaciones)));
});

// ----- Leer (R) -----
// Qué hace: devuelve un solo producto por su código. Los "?" de la consulta
// se reemplazan por los valores del arreglo; así se evita la inyección SQL.
rutas.get('/productos/:codigo', async (peticion, respuesta) => {
  const codigo = Number(peticion.params.codigo);
  const [filas] = await conexion.query(CONSULTA_PRODUCTOS + ' WHERE p.codigo = ?', [codigo]);

  if (filas.length === 0) {
    return respuesta.status(404).json({ error: 'El producto no existe.' });
  }

  const [especificaciones] = await conexion.query(
    'SELECT * FROM especificaciones WHERE producto_codigo = ? ORDER BY id',
    [codigo]
  );
  respuesta.json(armarProducto(filas[0], especificaciones));
});

// ----- Crear (C) -----
// Qué hace: guarda un producto nuevo. El código no es autoincremental en la
// tabla, así que se calcula como el mayor código existente más uno.
rutas.post('/productos', async (peticion, respuesta) => {
  const datos = peticion.body;
  const error = validar(datos);

  if (error) {
    return respuesta.status(400).json({ error });
  }

  const transaccion = await conexion.getConnection();

  try {
    await transaccion.beginTransaction();

    const [[{ siguiente }]] = await transaccion.query(
      'SELECT COALESCE(MAX(codigo), 0) + 1 AS siguiente FROM productos FOR UPDATE'
    );

    await transaccion.query(
      `INSERT INTO productos
         (codigo, nombre, categoria_id, marca, precio, disponible, envio_gratis, descripcion, imagen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        siguiente,
        datos.nombre.trim(),
        datos.categoriaId,
        datos.marca.trim(),
        datos.precio,
        Boolean(datos.disponible),
        Boolean(datos.envioGratis),
        datos.descripcion.trim(),
        datos.imagen ? datos.imagen.trim() : null,
      ]
    );

    await guardarEspecificaciones(transaccion, siguiente, datos.especificaciones);
    await transaccion.commit();

    respuesta.status(201).json({ codigo: siguiente });
  } catch (error) {
    await transaccion.rollback();
    respuesta.status(500).json({ error: error.message });
  } finally {
    transaccion.release();
  }
});

// ----- Actualizar (U) -----
// Qué hace: reemplaza los datos de un producto existente y sus
// especificaciones.
rutas.put('/productos/:codigo', async (peticion, respuesta) => {
  const codigo = Number(peticion.params.codigo);
  const datos = peticion.body;
  const error = validar(datos);

  if (error) {
    return respuesta.status(400).json({ error });
  }

  const transaccion = await conexion.getConnection();

  try {
    await transaccion.beginTransaction();

    const [resultado] = await transaccion.query(
      `UPDATE productos
       SET nombre = ?, categoria_id = ?, marca = ?, precio = ?, disponible = ?,
           envio_gratis = ?, descripcion = ?, imagen = ?
       WHERE codigo = ?`,
      [
        datos.nombre.trim(),
        datos.categoriaId,
        datos.marca.trim(),
        datos.precio,
        Boolean(datos.disponible),
        Boolean(datos.envioGratis),
        datos.descripcion.trim(),
        datos.imagen ? datos.imagen.trim() : null,
        codigo,
      ]
    );

    if (resultado.affectedRows === 0) {
      await transaccion.rollback();
      return respuesta.status(404).json({ error: 'El producto no existe.' });
    }

    await guardarEspecificaciones(transaccion, codigo, datos.especificaciones);
    await transaccion.commit();

    respuesta.json({ codigo });
  } catch (error) {
    await transaccion.rollback();
    respuesta.status(500).json({ error: error.message });
  } finally {
    transaccion.release();
  }
});

// ----- Eliminar (D) -----
// Qué hace: borra un producto. Sus especificaciones se borran solas por el
// ON DELETE CASCADE de la tabla.
rutas.delete('/productos/:codigo', async (peticion, respuesta) => {
  const codigo = Number(peticion.params.codigo);
  const [resultado] = await conexion.query('DELETE FROM productos WHERE codigo = ?', [codigo]);

  if (resultado.affectedRows === 0) {
    return respuesta.status(404).json({ error: 'El producto no existe.' });
  }

  respuesta.status(204).end();
});

module.exports = rutas;
