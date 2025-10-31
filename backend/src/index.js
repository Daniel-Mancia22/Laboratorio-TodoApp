const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');
const tasksRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/tasks', tasksRoutes);

// Health check
app.get('/health', async (req, res) => {
    try {
        const { pool } = require('./config/database');
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'OK', database: 'connected' });
    } catch (err) {
        res.status(500).json({ status: 'ERROR', database: 'disconnected' });
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Tareas funcionando' });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Inicializar y arrancar servidor
async function startServer() {
    try {
        await initializeDatabase();

        app.listen(port, () => {
            console.log(`Servidor backend corriendo en puerto ${port}`);
            console.log(`Health check disponible en http://localhost:${port}/health`);
        });
    } catch (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
}

startServer();