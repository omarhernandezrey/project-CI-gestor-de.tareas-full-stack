import express from 'express';
import { initDB, pool } from './db/connection';

const app = express();
app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (_req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
});

app.get('/', (_req, res) => {
  res.json({ message: 'Bienvenido al gestor de tareas', version: '1.0.0', status: 'OK' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', container: 'backend-api', timestamp: new Date().toISOString() });
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

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body as { completed: boolean };
  const result = await pool.query(
    'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *', [completed, id]
  );
  res.json({ success: true, data: result.rows[0] });
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  res.json({ success: true, message: 'Tarea eliminada' });
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
  app.listen(3000, () => console.log('🚀 API corriendo en http://localhost:3000'));
}

start();
