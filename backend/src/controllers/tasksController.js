const { pool } = require('../config/database');

const tasksController = {
    // Obtener todas las tareas
    async getAllTasks(req, res, next) {
        try {
            const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
            res.status(200).json(result.rows);
        } catch (err) {
            next(err);
        }
    },

    // Crear nueva tarea
    async createTask(req, res, next) {
        try {
            const { title } = req.body;

            if (!title || title.trim() === '') {
                return res.status(400).json({ error: 'El título es requerido' });
            }

            const result = await pool.query(
                'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
                [title.trim()]
            );

            res.status(201).json(result.rows[0]);
        } catch (err) {
            next(err);
        }
    },

    // Actualizar tarea
    async updateTask(req, res, next) {
        try {
            const { id } = req.params;
            const { completed, title } = req.body;

            let query = '';
            let params = [];

            if (typeof completed !== 'undefined' && title) {
                query = 'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *';
                params = [completed, title, id];
            } else if (typeof completed !== 'undefined') {
                query = 'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *';
                params = [completed, id];
            } else if (title) {
                query = 'UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *';
                params = [title, id];
            } else {
                return res.status(400).json({ error: 'Se requiere completed o title' });
            }

            const result = await pool.query(query, params);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }

            res.status(200).json(result.rows[0]);
        } catch (err) {
            next(err);
        }
    },

    // Eliminar tarea
    async deleteTask(req, res, next) {
        try {
            const { id } = req.params;

            const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
};

module.exports = tasksController;