const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, initDB } = require('./db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database
initDB();

// API Endpoints
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userRole = role || 'Alumno';
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, userRole]
        );
        res.status(201).json({ message: 'User registered', user: { id: result.insertId, name, email, role: userRole } });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            const user = rows[0];
            delete user.password; // Don't send password back
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

app.get('/api/activities', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM activities ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
});

app.post('/api/activities', async (req, res) => {
    try {
        const { title, description } = req.body;
        const [result] = await pool.query(
            'INSERT INTO activities (title, description) VALUES (?, ?)',
            [title, description]
        );
        res.status(201).json({ id: result.insertId, title, description });
    } catch (error) {
        res.status(500).json({ message: 'Error creating activity', error: error.message });
    }
});

app.post('/api/participantes', async (req, res) => {
    try {
        const { userId, activityId } = req.body;
        const [result] = await pool.query(
            'INSERT INTO enrollments (user_id, activity_id) VALUES (?, ?)',
            [userId, activityId]
        );
        res.status(201).json({ id: result.insertId, userId, activityId, attended: false });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'User already enrolled in this activity' });
        }
        res.status(500).json({ message: 'Error enrolling user', error: error.message });
    }
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
