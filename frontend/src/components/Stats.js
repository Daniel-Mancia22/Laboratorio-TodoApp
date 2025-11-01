export class Stats {
    constructor() {
        this.totalElement = document.getElementById('totalTasks');
        this.completedElement = document.getElementById('completedTasks');
        this.pendingElement = document.getElementById('pendingTasks');
    }

    update(tasks) {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        this.totalElement.textContent = `Total: ${totalTasks}`;
        this.completedElement.textContent = `Completadas: ${completedTasks}`;
        this.pendingElement.textContent = `Pendientes: ${pendingTasks}`;
    }
}