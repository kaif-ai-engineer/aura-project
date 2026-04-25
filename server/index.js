const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// i'm making some changes here for testing purpose. 
//the code which will come here will be for login purpose.

// Mock Data
let tasks = [
    { id: 1, title: 'Refactor Auth System', status: 'In Progress', priority: 'High', category: 'Backend' },
    { id: 2, title: 'Design Aura UI System', status: 'Completed', priority: 'Critical', category: 'Design' },
    { id: 3, title: 'Implement Dashboard Widgets', status: 'Todo', priority: 'Medium', category: 'Frontend' },
    { id: 4, title: 'Server-side Optimization', status: 'Todo', priority: 'Low', category: 'Performance' },
];

let stats = {
    completed: 12,
    ongoing: 5,
    pending: 8,
    efficiency: '94%'
};

// Routes
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.get('/api/stats', (req, res) => {
    res.json(stats);
});

app.post('/api/tasks', (req, res) => {
    const newTask = { id: Date.now(), ...req.body };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
