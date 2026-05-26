import express from 'express';
import { initDB, pool } from './db/connection';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Bienvenido al gestor de tareas', version: '1.0.0', status: 'OK' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', container: 'backend', mensaje: 'Contenedor 1 activo' });
});

app.get('/tasks', async (_req, res) => {
  const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
  res.json({ success: true, data: result.rows });
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body as { title: string };
  const result = await pool.query(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING *', [title]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

async function start() {
  let intentos = 10;
  while (intentos > 0) {
    try {
      await initDB();
      break;
    } catch {
      intentos--;
      console.log(`⏳ Esperando base de datos... ${intentos} intentos`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  app.listen(3000, () => console.log('🚀 Backend en http://localhost:3000'));
}

start();
