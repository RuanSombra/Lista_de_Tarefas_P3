// PADRÃO SINGLETON - TaskManager
class TaskManager {
    constructor() {
        if (TaskManager.instance) {
            return TaskManager.instance;
        }

        this.tasks = this.loadTasksFromStorage();
        this.observers = [];
        this.nextId = this.calculateNextId();

        TaskManager.instance = this;
    }
    // carregar tarefas do localStorage
    loadTasksFromStorage() {
        const tasksJson = localStorage.getItem('taskManagerTasks');
        if (tasksJson) {
            try {
                const tasks = JSON.parse(tasksJson);
                return Array.isArray(tasks) ? tasks : [];
            } catch (error) {
                console.error('Erro:', error);
                return [];
            }
        }
        return [];
    }
    // salvar tarefas no localStorage
    saveTasksToStorage() {
        try {
            localStorage.setItem('taskManagerTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Erro:', error);
        }
    }
    // Calcular o próximo ID baseado nas tarefas existentes
    calculateNextId() {
        if (this.tasks.length === 0) return 1;
        const maxId = Math.max(...this.tasks.map(task => task.id));
        return maxId + 1;
    }

    static getInstance() {
        if (!TaskManager.instance) {
            TaskManager.instance = new TaskManager();
        }
        return TaskManager.instance;
    }
    // PADRÃO OBSERVER
    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => {
            observer.update(this.tasks);
        });
    }
    // CRUD
    // Todos salvam no localStorage 
    addTask(name, description, status) {
        const task = {
            id: this.nextId++,
            name: name,
            description: description,
            status: status
        };

        this.tasks.push(task);
        this.saveTasksToStorage();
        this.notifyObservers();
        return task;
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasksToStorage();
        this.notifyObservers();
    }

    updateTaskStatus(id, newStatus) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.status = newStatus;
            this.saveTasksToStorage();
            this.notifyObservers();
        }
    }

    getTasks() {
        return this.tasks;
    }
}


// OBSERVADOR - UIObserver

class UIObserver {
    constructor() {
        this.containers = {
            'Disponível': document.getElementById('tasksDisponivel'),
            'Fazendo': document.getElementById('tasksFazendo'),
            'Feita': document.getElementById('tasksFeita')
        };

        this.counters = {
            'Disponível': document.getElementById('countDisponivel'),
            'Fazendo': document.getElementById('countFazendo'),
            'Feita': document.getElementById('countFeita')
        };
    }

    update(tasks) {
        this.renderTasks(tasks);
        this.updateCounters(tasks);
    }

    renderTasks(tasks) {
        const statuses = ['Disponível', 'Fazendo', 'Feita'];

        statuses.forEach(status => {
            const tasksForStatus = tasks.filter(task => task.status === status);
            this.renderColumn(status, tasksForStatus);
        });
    }

    renderColumn(status, tasks) {
        const container = this.containers[status];

        if (tasks.length === 0) {
            container.innerHTML = '<div class="empty-msg">Nenhuma tarefa</div>';
            return;
        }

        container.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
    }

    createTaskCard(task) {
        const statusClass = task.status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return `
            <div class="task-card">
                <div class="task-title">${this.escapeHtml(task.name)}</div>
                ${task.description
                    ? `<div class="task-desc">${this.escapeHtml(task.description)}</div>`
                    : ''
                }
                <div class="task-status ${statusClass}">${task.status}</div>
                
                <div class="task-buttons">
                    <button class="btn-status ${task.status === 'Disponível' ? 'active' : ''}" 
                            onclick="changeStatus(${task.id}, 'Disponível')">
                        Disponível
                    </button>
                    <button class="btn-status ${task.status === 'Fazendo' ? 'active' : ''}" 
                            onclick="changeStatus(${task.id}, 'Fazendo')">
                        Fazendo
                    </button>
                    <button class="btn-status ${task.status === 'Feita' ? 'active' : ''}" 
                            onclick="changeStatus(${task.id}, 'Feita')">
                        Feita
                    </button>
                    <button class="btn-delete" onclick="deleteTask(${task.id})">
                        Excluir
                    </button>
                </div>
            </div>
        `;
    }

    updateCounters(tasks) {
        const statuses = ['Disponível', 'Fazendo', 'Feita'];

        statuses.forEach(status => {
            const count = tasks.filter(task => task.status === status).length;
            this.counters[status].textContent = count;
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Funções

function changeStatus(taskId, newStatus) {
    const manager = TaskManager.getInstance();
    manager.updateTaskStatus(taskId, newStatus);
}

function deleteTask(taskId) {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
        const manager = TaskManager.getInstance();
        manager.removeTask(taskId);
    }
}


// Inicialização

document.addEventListener('DOMContentLoaded', () => {
    const taskManager = TaskManager.getInstance();
    const uiObserver = new UIObserver();

    taskManager.addObserver(uiObserver);
    uiObserver.update(taskManager.getTasks());

    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskStatusSelect = document.getElementById('taskStatus');

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = taskNameInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const status = taskStatusSelect.value;

        if (name) {
            taskManager.addTask(name, description, status);

            taskNameInput.value = '';
            taskDescriptionInput.value = '';
            taskStatusSelect.value = 'Disponível';
            taskNameInput.focus();
        }
    });


    console.log('Sistema de Lista de Tarefas iniciado!');
    console.log('Padrões implementados: Singleton e Observer');
});
