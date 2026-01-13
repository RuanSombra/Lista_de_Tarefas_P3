# Sistema de Gerenciamento de Tarefas

## Descrição do Projeto

Sistema web de gerenciamento de tarefas desenvolvido como projeto acadêmico para a disciplina de Engenharia de Software. A aplicação permite criar, visualizar, atualizar e deletar tarefas, organizadas em três colunas de status: Disponível, Fazendo e Feita.

## Equipe de Desenvolvimento

- Ruan Pactrick de Sousa e Sousa
- Eduardo Oliveira
- João Pedro Moura de Mendonça

## Tecnologias Utilizadas

- **HTML**: Estruturação da interface do usuário
- **CSS**: Estilização e layout responsivo
- **JavaScript**: Lógica de aplicação e manipulação do DOM

## Padrões de Projeto Implementados

### 1. Singleton Pattern

**Arquivo referente:**: `TaskManager.js`

A ideia é garantir que apenas uma instância do gerenciador de tarefas exista durante toda a execução da aplicação.

**Implementação**:

```javascript
constructor() {
    if (TaskManager.instance) {
        return TaskManager.instance;
    }
    // ... inicialização
    TaskManager.instance = this;
}

static getInstance() {
    if (!TaskManager.instance) {
        TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
}
```

O padrão Singleton é essencial neste contexto para manter a consistência dos dados das tarefas e evitar conflitos de estado. Com uma única instância, garantimos que todas as operações (criar, atualizar, deletar) atuem sobre o mesmo conjunto de dados, facilitando o gerenciamento e sincronização com o localStorage.

### 2. Observer Pattern

**Arquivos referentes:**: `UIObserver.js` e `TaskManager.js`

Utilizado para estabelecer uma relação de dependência um-para-muitos entre objetos, onde quando o estado do objeto observado muda, todos os seus dependentes são notificados e atualizados automaticamente.

**Implementação**:

**No TaskManager (Subject)**:

```javascript
addObserver(observer) {
    this.observers.push(observer);
}

notifyObservers() {
    this.observers.forEach(observer => {
        observer.update(this.tasks);
    });
}
```

**No UIObserver (Observer)**:

```javascript
update(tasks) {
    this.renderTasks(tasks);
    this.updateCounters(tasks);
}
```

O padrão Observer permite a separação de responsabilidades entre a lógica de negócio (TaskManager) e a interface do usuário (UIObserver). Sempre que uma tarefa é adicionada, removida ou atualizada, o TaskManager notifica automaticamente o UIObserver, que re-renderiza a interface sem acoplamento direto entre as classes.

## Estrutura do Projeto

```
projeto/
│
├── index.html                      # Página principal
├── style.css                       # Arquivo de importação de estilos
│
├── src/
│   ├── app.js                      # Inicialização da aplicação
│   ├── handlers/
│   │   └── handlers.js             # Funções globais de manipulação
│   ├── managers/
│   │   └── TaskManager.js          # Gerenciador de tarefas (Singleton)
│   └── observers/
│       └── UIObserver.js           # Observador de interface (Observer)
│
└── styles/
    ├── global.css                  # Estilos globais
    ├── components/
    │   ├── button.css              # Estilos dos botões
    │   ├── crud.css                # Estilos do board de tarefas
    │   └── form.css                # Estilos do formulário
    └── layout/
        ├── header.css              # Estilos do cabeçalho
        └── footer.css              # Estilos do rodapé
```

## Funcionalidades

### 1. Adicionar Tarefa
- Formulário com campos: nome (obrigatório), descrição (opcional) e status
- Validação de campos obrigatórios
- Persistência automática no localStorage

### 2. Visualizar Tarefas
- Organização em três colunas: Disponível, Fazendo e Feita
- Contadores de tarefas por status
- Cards informativos com título, descrição e status

### 3. Atualizar Status
- Botões de ação rápida para alterar o status da tarefa
- Indicação visual do status atual
- Atualização automática da interface

### 4. Deletar Tarefa
- Confirmação antes da exclusão
- Remoção permanente do localStorage
- Atualização automática dos contadores

## Persistência de Dados

O sistema utiliza o **localStorage** do navegador para persistir as tarefas entre sessões. As operações de leitura e escrita são gerenciadas pela classe TaskManager:

- `loadTasksFromStorage()`: Carrega tarefas ao inicializar
- `saveTasksToStorage()`: Salva alterações automaticamente
- Tratamento de erros em operações de storage

## Fluxo de Dados 

1. **Inicialização** (`app.js`):
   - Cria instância única do TaskManager
   - Cria UIObserver
   - Registra o observer no manager
   - Renderiza tarefas existentes

2. **Adição de Tarefa**:
   - Usuário preenche formulário
   - Submit dispara evento
   - TaskManager adiciona tarefa
   - Notifica observers
   - UIObserver atualiza interface

3. **Atualização de Status**:
   - Usuário clica em botão de status
   - Handler global chama TaskManager
   - TaskManager atualiza status
   - Notifica observers
   - Interface é re-renderizada

4. **Deleção de Tarefa**:
   - Usuário clica em excluir
   - Confirmação é solicitada
   - TaskManager remove tarefa
   - Notifica observers
   - Interface é atualizada

## Como Executar

1. Clone ou baixe o repositório
2. Abra o arquivo `index.html` em um navegador moderno
3. Não há necessidade de servidor ou dependências externas
