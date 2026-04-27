const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'aura-secret-key-123';

// Seed initial data if needed
const seedData = async () => {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await prisma.user.create({
            data: { email: 'admin@aura.sh', password: hashedPassword }
        });
        
        await prisma.task.createMany({
            data: [
                { title: 'Refactor Auth System', status: 'In Progress', priority: 'High', category: 'Backend' },
                { title: 'Design Aura UI System', status: 'Completed', priority: 'Critical', category: 'Design' },
                { title: 'Implement Dashboard Widgets', status: 'Todo', priority: 'Medium', category: 'Frontend' },
                { title: 'Server-side Optimization', status: 'Todo', priority: 'Low', category: 'Performance' },
            ]
        });
        
        await prisma.stat.create({
            data: { completed: 12, ongoing: 5, pending: 8, efficiency: '94%' }
        });
        
        console.log('Seeded initial data.');
    }
};

seedData();

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, user: { id: user.id, email: user.email } });
    }
    
    res.status(401).json({ message: 'Invalid credentials' });
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

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
app.get('/api/tasks', authenticateToken, async (req, res) => {
    const tasks = await prisma.task.findMany({ orderBy: { id: 'desc' } });
    res.json(tasks);
});

app.get('/api/stats', authenticateToken, async (req, res) => {
    const [completed, ongoing, pending] = await Promise.all([
        prisma.task.count({ where: { status: 'Completed' } }),
        prisma.task.count({ where: { status: 'In Progress' } }),
        prisma.task.count({ where: { status: 'Todo' } })
    ]);
    
    const total = completed + ongoing + pending;
    const efficiency = total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%';

    res.json({ completed, ongoing, pending, efficiency });
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
    const { title, status, priority, category } = req.body;
    const newTask = await prisma.task.create({
        data: { title, status, priority, category }
    });
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, status, priority, category } = req.body;
    try {
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: { title, status, priority, category }
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.task.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: 'Task not found' });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
