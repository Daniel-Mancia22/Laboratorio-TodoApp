import { formatDate, escapeHtml } from '../utils/helpers.js';

export class TaskItem {
    constructor(task, onToggle, onEdit, onSave, onCancel, onDelete) {
        this.task = task;
        this.onToggle = onToggle;
        this.onEdit = onEdit;
        this.onSave = onSave;
        this.onCancel = onCancel;
        this.onDelete = onDelete;
        this.isEditing = false;
    }

    render() {
        const { date, time } = formatDate(this.task.created_at);

        if (this.isEditing) {
            return this.renderEditMode(date, time);
        }

        return this.renderViewMode(date, time);
    }

    renderViewMode(date, time) {
        return `
            <div class="task-item ${this.task.completed ? 'completed' : ''}" data-task-id="${this.task.id}">
                <div class="task-content">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${this.task.completed ? 'checked' : ''}
                        onchange="window.taskManager.toggleTask(${this.task.id})"
                    >
                    <span class="task-text">${escapeHtml(this.task.title)}</span>
                    <div class="task-date-container">
                        <span class="task-date">${date}</span>
                        <span class="task-time">${time}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="window.taskManager.startEdit(${this.task.id})" title="Editar tarea">
                        <span class="edit-icon">✏️</span>
                        Editar
                    </button>
                    <button class="delete-btn" onclick="window.taskManager.deleteTask(${this.task.id})" title="Eliminar tarea">
                        <span class="delete-icon">🗑️</span>
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    }

    renderEditMode(date, time) {
        return `
            <div class="task-item editing" data-task-id="${this.task.id}">
                <div class="task-content">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${this.task.completed ? 'checked' : ''}
                        onchange="window.taskManager.toggleTask(${this.task.id})"
                    >
                    <input 
                        type="text" 
                        class="task-edit-input" 
                        value="${escapeHtml(this.task.title)}"
                        maxlength="255"
                        onkeypress="if(event.key==='Enter') window.taskManager.saveEdit(${this.task.id})"
                        onkeydown="if(event.key==='Escape') window.taskManager.cancelEdit(${this.task.id})"
                    >
                    <div class="task-date-container">
                        <span class="task-date">${date}</span>
                        <span class="task-time">${time}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <div class="edit-actions">
                        <button class="save-btn" onclick="window.taskManager.saveEdit(${this.task.id})" title="Guardar cambios">
                            <span class="save-icon">💾</span>
                            Guardar
                        </button>
                        <button class="cancel-btn" onclick="window.taskManager.cancelEdit(${this.task.id})" title="Cancelar edición">
                            <span class="cancel-icon">❌</span>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setEditing(editing) {
        this.isEditing = editing;
    }
}