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

// vmaos ver se foi kkkk
console.log(" TESTE DO TASKMANAGER");


console.log("1. Testando Singleton...");
const manager1 = TaskManager.getInstance();
const manager2 = TaskManager.getInstance();
console.log("São a mesma instancia?", manager1 === manager2);


localStorage.clear();


console.log("\n2. Testando adição de tarefas...");
const task1 = manager1.addTask("Estudar JavaScript", "Revisar ES6", "Disponivel");
console.log("Tarefa 1 criada:", task1);

const task2 = manager1.addTask("Fazer exerccios", "Pratica patterns", "Fazendo");
console.log("Tarefa 2 criada:", task2);


console.log("\n3. Verificando localStorage");
const saved = localStorage.getItem('taskManagerTasks');
console.log("Dados no localStorage:", saved);
console.log("Parser:", JSON.parse(saved));


console.log("\n4. Testando update de status");
manager1.updateTaskStatus(task1.id, "Feita");
console.log("Tarefa 1 atualizada para Feita");
console.log("Tarefas apos update:", manager1.getTasks());


console.log("\n5. Testando remocao");
manager1.removeTask(task2.id);
console.log("Tarefa 2 removida");
console.log("Tarefas restante:", manager1.getTasks());


console.log("\n6. Testando persistencia");
TaskManager.instance = null; 
const manager3 = TaskManager.getInstance(); 
console.log("Tarefas apos refresh:", manager3.getTasks());
console.log("Proximo id calculado:", manager3.nextId);

// Na hora de fazer a parte de voce podem apagar esse teste acima
