const mysql = require('mysql2/promise');

// ----- Conexión a MySQL -----
// Qué hace: crea un "pool", un grupo de conexiones abiertas que se reutilizan.
// Así cada consulta no tiene que volver a conectarse desde cero.
// Los datos salen de servidor/.env, que no se sube a GitHub.
const conexion = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = conexion;
