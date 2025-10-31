const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'todoapp',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Inicializar base de datos
async function initializeDatabase() {
    try {
        const client = await pool.connect();

        await client.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        console.log('Tabla tasks verificada/creada correctamente');
        client.release();
    } catch (err) {
        console.error('Error inicializando la base de datos:', err);
        throw err;
    }
}

module.exports = { pool, initializeDatabase };