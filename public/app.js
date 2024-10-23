function addTodo() {
    const input = document.getElementById('todo-input');
    const task = input.value.trim();

    if (task) {
        const data = { task: task };

        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(todo => {
            appendTodoToUI(todo);
            input.value = '';
        })
        .catch(error => console.error('Error:', error));
    }
}

function updateTodo(id) {
    const task = prompt('Enter the updated task:');
    
    if (task) {
        fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: task }),
        })
        .then(response => response.json())
        .then(() => {
            document.querySelector(`[data-id='${id}'] .task-text`).textContent = task;
        })
        .catch(error => console.error('Error:', error));
    }
}

function appendTodoToUI(todo) {
    const ul = document.getElementById('todo-list');
    const li = document.createElement('li');
    li.setAttribute('data-id', todo.id);

    li.innerHTML = `
        <span class="task-text" id="task">${todo.task}</span>
        <button onclick="updateTodo('${todo.id}')">Edit</button>
        <button onclick="deleteTodo('${todo.id}')">Delete</button>
    `;
    ul.appendChild(li);
}

function deleteTodo(id) {
    fetch(`/api/todos/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        document.querySelector(`[data-id='${id}']`).remove();
    })
    .catch(error => console.error('Error:', error));
}

function completeTodo(id){
    
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/todos')
    .then(response => response.json())
    .then(todos => {
        todos.forEach(todo => appendTodoToUI(todo));
    })
    .catch(error => console.error('Error:', error));
});
