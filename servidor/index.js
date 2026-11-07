const express = require('express');
const conexion = require('./conexion');
const rutasProductos = require('./productos');

// ----- Servidor -----
// Qué hace: es el intermediario entre React y MySQL. El navegador no puede
// hablar directo con la base de datos (además expondría la contraseña), así
// que React le pide los datos a este servidor y el servidor consulta MySQL.
const app = express();
const PUERTO = Number(process.env.PUERTO) || 4000;

// Permite recibir datos en formato JSON en las peticiones POST.
app.use(express.json());

// ----- Ruta -----
// Qué hace: comprueba que la conexión con MySQL funciona. Devuelve el nombre
// de la base de datos y la versión de MySQL.
app.get('/api/estado', async (peticion, respuesta) => {
  try {
    const [filas] = await conexion.query(
      'SELECT DATABASE() AS baseDeDatos, VERSION() AS version'
    );
    respuesta.json({ conectado: true, ...filas[0] });
  } catch (error) {
    respuesta.status(500).json({ conectado: false, error: error.message });
  }
});

// Rutas del CRUD de productos y categorías (ver servidor/productos.js).
app.use('/api', rutasProductos);

// ----- Manejo de errores -----
// Qué hace: si una consulta falla (por ejemplo, MySQL apagado), responde con
// el mensaje en JSON en lugar de dejar la petición colgada.
app.use((error, peticion, respuesta, siguiente) => {
  console.error(error);
  respuesta.status(500).json({ error: error.message });
});

// Al arrancar se hace una consulta de prueba para avisar en la terminal si
// los datos de servidor/.env están bien.
app.listen(PUERTO, async () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);

  try {
    await conexion.query('SELECT 1');
    console.log(`Conectado a MySQL, base de datos "${process.env.DB_NAME}".`);
  } catch (error) {
    console.error('No se pudo conectar a MySQL:', error.message);
  }
});
