// O padrão Singleton

class TaskManager {

    // Verifique se já existe um gerenciador de tarefas e garante com que utilize apenas uma instância.

    constructor() {
        if (TaskManager.instance) {
            return TaskManager.instance;
        }

        this.tasks = this.loadTasksFromStorage();
        this.observers = [];
        this.nextId = this.calculateNextId();

        TaskManager.instance = this;
    }

    // Carrega as tarefas na memoria

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

    // Salva as tarefas na memoria

    saveTasksToStorage() {
        try {
            localStorage.setItem('taskManagerTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Erro:', error);
        }
    }

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

    // Observa o que está sendo adicionado

    addObserver(observer) {
        this.observers.push(observer);
    }

    // Observa o que está sendo removido

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    // Faz uma verificação em qualquer atualização e notifica o observador

    notifyObservers() {
        this.observers.forEach(observer => {
            observer.update(this.tasks);
        });
    }

    // Aqui possui as definições dos parâmetros de cada opção (função) da lista de tarefas - adicionar, remover, atualizar e retornar

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