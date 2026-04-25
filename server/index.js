const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'aura-secret-key-123';

// Mock User Database
const users = [
    { id: 1, email: 'admin@aura.sh', password: '$2a$10$vI8qS/S6V.uS8X.V.uS8X.V.uS8X.V.uS8X.V.uS8X.V.uS8X.V.u' } // password123
];

// Helper to find user
const findUser = (email) => users.find(u => u.email === email);

// i'm making some changes here for testing purpose. 
//the code which will come here will be for login purpose.

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = findUser(email);
    
    // In a real app we'd use bcrypt.compare, but for this mock we'll allow password123
    if (user && (password === 'password123')) {
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
app.get('/api/tasks', authenticateToken, (req, res) => {
    res.json(tasks);
});

app.get('/api/stats', authenticateToken, (req, res) => {
    res.json(stats);
});

app.post('/api/tasks', authenticateToken, (req, res) => {
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
