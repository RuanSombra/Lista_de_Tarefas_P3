// Funções Globais

// Permite com que o usuário interaja realizando a mudança de status da tarefa ao clicar no botão

function changeStatus(taskId, newStatus) {
    const manager = TaskManager.getInstance();
    manager.updateTaskStatus(taskId, newStatus);
}

// Permite deletar uma tarefa após a confirmação do usuário

function deleteTask(taskId) {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
        const manager = TaskManager.getInstance();
        manager.removeTask(taskId);
    }
}
