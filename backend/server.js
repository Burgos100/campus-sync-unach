const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock DB
const users = [];
const activities = [];
const enrollments = [];

// API Endpoints
app.post('/api/users/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const user = { id: users.length + 1, name, email, password, role: role || 'Alumno' };
    users.push(user);
    res.status(201).json({ message: 'User registered', user });
});

app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.get('/api/activities', (req, res) => {
    res.json(activities);
});

app.post('/api/activities', (req, res) => {
    const { title, description } = req.body;
    const activity = { id: activities.length + 1, title, description };
    activities.push(activity);
    res.status(201).json(activity);
});

app.post('/api/participantes', (req, res) => {
    const { userId, activityId } = req.body;
    const enrollment = { userId, activityId, attended: false };
    enrollments.push(enrollment);
    res.status(201).json(enrollment);
});

app.post('/api/generate-description', (req, res) => {
    const { topic } = req.body;
    // Simulate AI generation
    res.json({ description: `Actividad generada automáticamente sobre ${topic}. Aprenderás sobre ${topic} y su aplicación en la universidad.` });
});

module.exports = app;

if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
