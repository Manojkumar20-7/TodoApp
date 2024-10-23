const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = './todos.json';

// Helper function to read the JSON file
function readTodosFromFile() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper function to write to the JSON file
function writeTodosToFile(todos) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// GET all TODOs
app.get('/api/todos', (req, res) => {
    const todos = readTodosFromFile();
    res.json(todos);
});

// POST a new TODO
app.post('/api/todos', (req, res) => {
    const todos = readTodosFromFile();
    const newTodo = {
        id: Date.now().toString(),
        task: req.body.task,
        status:"Yet to finish"
    };
    todos.push(newTodo);
    writeTodosToFile(todos);
    console.log(newTodo);
    res.json(newTodo);
});

// PUT (update) an existing TODO
app.put('/api/todos/:id', (req, res) => {
    let todos = readTodosFromFile();
    const todoId = req.params.id;
    const updatedTask = req.body.task;

    todos = todos.map(todo => {
        if (todo.id === todoId) {
            return { ...todo, task: updatedTask };
        }
        return todo;
    });

    writeTodosToFile(todos);
    res.json({ message: 'Task updated successfully' });
});

// DELETE a TODO by ID
app.delete('/api/todos/:id', (req, res) => {
    let todos = readTodosFromFile();
    todos = todos.filter(todo => todo.id !== req.params.id);
    writeTodosToFile(todos);
    res.sendStatus(204);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
