const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
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
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, userRole]
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
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            const user = rows[0];
            
            // Check if it is a bcrypt hash (starts with $2a$, $2b$, etc.)
            let isMatch = false;
            if (user.password.startsWith('$2')) {
                isMatch = await bcrypt.compare(password, user.password);
            } else {
                // Fallback for old users with plain text passwords
                isMatch = (password === user.password);
                
                // Optional: Migrate their password to bcrypt here
                if (isMatch) {
                    const hashed = await bcrypt.hash(password, 10);
                    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id]);
                }
            }

            if (isMatch) {
                delete user.password; // Don't send password back
                res.json({ message: 'Login successful', user });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
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

// NUEVOS MÓDULOS

// 1. Alumno Inscripciones
app.get('/api/users/:id/enrollments', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT a.title, a.description, e.attended
            FROM enrollments e
            JOIN activities a ON e.activity_id = a.id
            WHERE e.user_id = ?
        `, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user enrollments', error: error.message });
    }
});

// 2. Admin Usuarios
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, role FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// 3. Admin Reportes (IA)
app.get('/api/reportes/generar', async (req, res) => {
    try {
        const [activitiesCountRows] = await pool.query('SELECT COUNT(*) as total FROM activities');
        const totalActivities = activitiesCountRows[0].total;

        const [attendanceRows] = await pool.query('SELECT COUNT(attended) as total_attended, COUNT(*) as total_enrollments FROM enrollments WHERE attended = true');
        const [allEnrollments] = await pool.query('SELECT COUNT(*) as total_enrollments FROM enrollments');
        
        const totalEnrollments = allEnrollments[0].total_enrollments;
        const totalAttended = attendanceRows[0].total_attended || 0;

        const prompt = `Actúa como un coordinador académico. Escribe un resumen ejecutivo breve y profesional en español sobre la participación en las actividades universitarias. Datos actuales: ${totalActivities} actividades creadas, ${totalEnrollments} inscripciones totales y ${totalAttended} asistencias confirmadas.`;

        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                reporte: `Resumen Ejecutivo (Simulado): Actualmente tenemos ${totalActivities} actividades con ${totalEnrollments} inscripciones y ${totalAttended} asistencias. (Configura GEMINI_API_KEY).`
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reporte: text });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}