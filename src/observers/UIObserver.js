// Padrão Observer

class UIObserver {

    // Verifica as mudanças no TaskManager e dps atualiza o HTML automaticamente.

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