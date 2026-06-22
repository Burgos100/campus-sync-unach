const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, initDB } = require('./db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database
if (process.env.NODE_ENV !== "test") {
    initDB();
}

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

app.post("/api/generate-description", async (req, res) => {
  const { topic } = req.body;

  // Si no hay API KEY (como en el entorno de testing local), usar fallback
  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      description: `Actividad generada automáticamente sobre ${topic}. Aprenderás sobre ${topic} y su aplicación en la universidad.`,
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Usamos gemini-2.5-flash porque es la versión estable y rápida soportada actualmente
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Actúa como un coordinador académico. Escribe una descripción breve y atractiva (máximo 3 líneas) para una actividad universitaria sobre el tema: "${topic}".`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ description: text });
  } catch (error) {
    console.error("Error generating AI content:", error);
    res.status(500).json({ error: "Error al generar la descripción con IA" });
  }
});

app.put('/api/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        await pool.query('UPDATE activities SET title = ?, description = ? WHERE id = ?', [title, description, id]);
        res.json({ message: 'Activity updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating activity', error: error.message });
    }
});

app.delete('/api/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM activities WHERE id = ?', [id]);
        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting activity', error: error.message });
    }
});

app.get('/api/activities/:id/participantes', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT e.id as enrollment_id, u.name, u.email, e.attended 
            FROM enrollments e 
            JOIN users u ON e.user_id = u.id 
            WHERE e.activity_id = ?
        `, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching participants', error: error.message });
    }
});

app.put('/api/participantes/:id/asistencia', async (req, res) => {
    try {
        const { id } = req.params;
        const { attended } = req.body;
        await pool.query('UPDATE enrollments SET attended = ? WHERE id = ?', [attended, id]);
        res.json({ message: 'Attendance updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating attendance', error: error.message });
    }
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}