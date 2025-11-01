export class TaskForm {
    constructor(onAddTask, errorCallback) {
        this.onAddTask = onAddTask;
        this.errorCallback = errorCallback;
        this.isSubmitting = false;
        this.initialize();
    }

    initialize() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');

        this.bindEvents();
        this.updateButtonState();
    }

    bindEvents() {
        // Click en el botón agregar
        this.addTaskBtn.addEventListener('click', () => this.handleAddTask());

        // Enter en el input
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddTask();
            }
        });

        // Validación en tiempo real
        this.taskInput.addEventListener('input', () => {
            this.updateButtonState();
            this.hideError();
        });

        // Focus para mejor UX
        this.taskInput.addEventListener('focus', () => {
            this.taskInput.style.borderColor = '#667eea';
        });

        this.taskInput.addEventListener('blur', () => {
            this.taskInput.style.borderColor = '#e2e8f0';
        });
    }

    async handleAddTask() {
        if (this.isSubmitting) return;

        const title = this.taskInput.value.trim();

        if (!this.validateInput(title)) {
            return;
        }

        this.setSubmittingState(true);

        try {
            await this.onAddTask(title);
            this.resetForm();
            this.showSuccessFeedback();
        } catch (error) {
            this.handleAddError(error);
        } finally {
            this.setSubmittingState(false);
        }
    }

    validateInput(title) {
        if (!title) {
            this.showError('❌ Por favor, ingresa una tarea');
            this.shakeInput();
            return false;
        }

        if (title.length < 2) {
            this.showError('📝 La tarea debe tener al menos 2 caracteres');
            this.shakeInput();
            return false;
        }

        if (title.length > 255) {
            this.showError('📏 La tarea es demasiado larga (máximo 255 caracteres)');
            this.shakeInput();
            return false;
        }

        return true;
    }

    setSubmittingState(submitting) {
        this.isSubmitting = submitting;

        if (submitting) {
            this.addTaskBtn.disabled = true;
            this.addTaskBtn.innerHTML = '⏳ Agregando...';
            this.taskInput.disabled = true;
        } else {
            this.updateButtonState();
            this.taskInput.disabled = false;
        }
    }

    updateButtonState() {
        const hasText = this.taskInput.value.trim().length > 0;

        if (hasText && !this.isSubmitting) {
            this.addTaskBtn.disabled = false;
            this.addTaskBtn.innerHTML = '➕ Agregar Tarea';
            this.addTaskBtn.style.opacity = '1';
            this.addTaskBtn.style.cursor = 'pointer';
        } else {
            this.addTaskBtn.disabled = true;
            this.addTaskBtn.innerHTML = '➕ Agregar Tarea';
            this.addTaskBtn.style.opacity = '0.6';
            this.addTaskBtn.style.cursor = 'not-allowed';
        }
    }

    resetForm() {
        this.taskInput.value = '';
        this.updateButtonState();
        this.hideError();
        this.taskInput.focus();
    }

    showSuccessFeedback() {
        // Feedback visual temporal
        const originalText = this.addTaskBtn.innerHTML;
        this.addTaskBtn.innerHTML = '✅ ¡Agregada!';
        this.addTaskBtn.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';

        setTimeout(() => {
            this.addTaskBtn.innerHTML = originalText;
            this.addTaskBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            this.updateButtonState();
        }, 1500);
    }

    showError(message) {
        if (this.errorCallback) {
            this.errorCallback(message);
        } else {
            // Fallback si no hay callback
            console.error('TaskForm Error:', message);

            // Mostrar error en el input
            this.taskInput.style.borderColor = '#f56565';
            this.taskInput.style.background = '#fed7d7';

            // Tooltip temporal
            const originalPlaceholder = this.taskInput.placeholder;
            this.taskInput.placeholder = message;

            setTimeout(() => {
                this.taskInput.placeholder = originalPlaceholder;
                this.taskInput.style.borderColor = '#e2e8f0';
                this.taskInput.style.background = '#f7fafc';
            }, 3000);
        }
    }

    hideError() {
        if (this.errorCallback) {
            // Asumimos que el errorCallback puede ocultar el error
            this.errorCallback('');
        }

        // Restaurar estilos del input
        this.taskInput.style.borderColor = '#e2e8f0';
        this.taskInput.style.background = '#f7fafc';
    }

    handleAddError(error) {
        console.error('Error adding task:', error);

        let errorMessage = '❌ Error al agregar la tarea';

        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            errorMessage = '🌐 Error de conexión. Verifica tu internet.';
        } else if (error.message.includes('500')) {
            errorMessage = '⚙️ Error del servidor. Intenta más tarde.';
        }

        this.showError(errorMessage);
        this.shakeInput();
    }

    shakeInput() {
        this.taskInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.taskInput.style.animation = '';
        }, 500);
    }

    // Métodos públicos para control externo
    focus() {
        this.taskInput.focus();
    }

    clear() {
        this.resetForm();
    }

    setValue(value) {
        this.taskInput.value = value;
        this.updateButtonState();
    }

    getValue() {
        return this.taskInput.value.trim();
    }

    // Destructor para limpieza
    destroy() {
        this.taskInput.removeEventListener('keypress', () => { });
        this.taskInput.removeEventListener('input', () => { });
        this.taskInput.removeEventListener('focus', () => { });
        this.taskInput.removeEventListener('blur', () => { });
        this.addTaskBtn.removeEventListener('click', () => { });
    }
}

// Agregar estilos de animación si no existen
if (!document.querySelector('#task-form-styles')) {
    const style = document.createElement('style');
    style.id = 'task-form-styles';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .task-input-error {
            border-color: #f56565 !important;
            background-color: #fed7d7 !important;
            animation: shake 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}
