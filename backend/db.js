const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'admin123',
  database: process.env.DB_NAME || 'campussync',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initDB = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      const connection = await pool.getConnection();
      
      // Create Users table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('Admin', 'Alumno') DEFAULT 'Alumno',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Activities table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS activities (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Enrollments (Participantes) table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS enrollments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          activity_id INT NOT NULL,
          attended BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
          UNIQUE(user_id, activity_id)
        )
      `);

      // Create Dashboard Metrics table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS dashboard_metrics (
          id INT AUTO_INCREMENT PRIMARY KEY,
          precision_ia INT DEFAULT 98,
          latencia FLOAT DEFAULT 1.2,
          satisfaccion FLOAT DEFAULT 4.8,
          asistencia_total INT DEFAULT 1240,
          actividades_mes INT DEFAULT 28,
          tasa_asistencia INT DEFAULT 92,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Insert default metrics if empty
      const [rows] = await connection.query('SELECT COUNT(*) as count FROM dashboard_metrics');
      if (rows[0].count === 0) {
        await connection.query(`
          INSERT INTO dashboard_metrics 
          (precision_ia, latencia, satisfaccion, asistencia_total, actividades_mes, tasa_asistencia) 
          VALUES (98, 1.2, 4.8, 1240, 28, 92)
        `);
      }

      connection.release();
      console.log('Database initialized successfully.');
      break; // Salimos del bucle si fue exitoso
    } catch (error) {
      console.error(`Error initializing database. Retries left: ${retries - 1}`, error.message);
      retries -= 1;
      // Esperar 5 segundos antes de reintentar
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = {
  pool,
  initDB
};
