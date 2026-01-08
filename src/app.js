// Basicamente é a "main" que cria e conecta todas as instâncias das classes

document.addEventListener('DOMContentLoaded', () => {
    const taskManager = TaskManager.getInstance(); // Cria a instância única do gerenciador de tarefas
    const uiObserver = new UIObserver(); // Cria a instância do observador de UI

    taskManager.addObserver(uiObserver); // Liga o observador com o gerenciador
    uiObserver.update(taskManager.getTasks()); // Renderiza as tarefas

    // Somente faz a ligação do html com o js das classes e id's

    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskStatusSelect = document.getElementById('taskStatus');

    // Os eventos são definidos aqui, ou seja, permite as interações do usuário de forma mais definida

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
});