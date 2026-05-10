const { Pool } = require('pg');

// Usamos las variables que pusiste en el archivo .env
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || '', 
  port: process.env.DB_PORT || 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log("❌ Error conectando a Postgres:", err.message);
  } else {
    console.log("✅ Base de Datos conectada y respondiendo");
  }
});