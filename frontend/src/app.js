import api from './services/api.js';
import { TaskItem } from './components/TaskItem.js';
import { Stats } from './components/Stats.js';
import { TaskForm } from './components/TaskForm.js';

const tasksList = document.getElementById('tasksList');
const errorMessage = document.getElementById('errorMessage');

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

let tasks = [];
let editingTaskId = null;


// Inicializar componentes
const stats = new Stats();
const taskForm = new TaskForm(handleAddTask, showError);

// Funciones principales
async function loadTasks() {
    try {
        tasks = await api.getTasks();
        renderTasks();
    } catch (err) {
        showError('❌ Error al cargar tareas');
    }
}

async function handleAddTask(title) {
    try {
        const newTask = await api.createTask(title);
        tasks.unshift(newTask);
        renderTasks();
    } catch (err) {
        throw err;
    }
}

async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
        const updated = await api.updateTask(id, { completed: !task.completed });
        tasks = tasks.map(t => t.id === id ? updated : t);
        renderTasks();
    } catch (err) {
        showError('❌ Error al actualizar tarea');
    }
}

function startEdit(id) {
    editingTaskId = id;
    renderTasks();
}

async function saveEdit(id) {
    const input = document.querySelector(`[data-task-id="${id}"] .task-edit-input`);
    const newTitle = input?.value.trim();
    if (!newTitle) return showError('📝 El título no puede estar vacío');

    try {
        const updated = await api.updateTask(id, { title: newTitle });
        tasks = tasks.map(t => t.id === id ? updated : t);
        editingTaskId = null;
        renderTasks();
    } catch (err) {
        showError('❌ Error al guardar cambios');
    }
}

function cancelEdit(id) {
    editingTaskId = null;
    renderTasks();
}

async function deleteTask(id) {
    if (!confirm('¿Eliminar esta tarea?')) return;

    try {
        await api.deleteTask(id);
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    } catch (err) {
        showError('❌ Error al eliminar tarea');
    }
}

// Renderizado
function renderTasks() {
    tasksList.innerHTML = "";

    if (tasks.length === 0) {
        tasksList.innerHTML = `<div class="empty-state">🌤️ No tienes tareas aún. ¡Agrega una para comenzar!</div>`;
        stats.update(tasks);
        return;
    }

    tasks.forEach(task => {
        const taskEl = document.createElement("div");
        taskEl.className = `task-item ${task.completed ? "completed" : ""} ${editingTaskId === task.id ? "editing" : ""}`;
        taskEl.setAttribute("data-task-id", task.id);

        if (editingTaskId === task.id) {
            // Modo edición
            taskEl.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} onchange="window.taskManager.toggleTask(${task.id})">
                    <input class="task-edit-input" value="${task.title}" />
                    <div class="task-date-container">
                        <span class="task-date">${task.created_at}</span>
                    </div>
                </div>
                <div class="task-actions edit-actions">
                    <button class="save-btn" onclick="window.taskManager.saveEdit(${task.id})">💾 Guardar</button>
                    <button class="cancel-btn" onclick="window.taskManager.cancelEdit(${task.id})">❌ Cancelar</button>
                </div>
            `;
        } else {
            // Modo normal con botón Editar
            taskEl.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} onchange="window.taskManager.toggleTask(${task.id})">
                    <span class="task-text">${task.title}</span>
                    <div class="task-date-container">
                        <span class="task-date">${task.created_at}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="window.taskManager.startEdit(${task.id})">✏️ Editar</button>
                    <button class="delete-btn" onclick="window.taskManager.deleteTask(${task.id})">🗑️ Eliminar</button>
                </div>
            `;
        }

        tasksList.appendChild(taskEl);
    });

    stats.update(tasks);
}

// Inicialización
window.taskManager = {
    toggleTask,
    startEdit,
    saveEdit,
    cancelEdit,
    deleteTask
};

loadTasks();
