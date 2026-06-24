import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

const API = '/api';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      const json = await res.json();
      setTasks(Array.isArray(json.data) ? json.data : []);
      setError(json.success === false ? 'Error al cargar las tareas' : '');
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    const title = newTitle.trim();
    if (!title) return;
    await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setNewTitle('');
    fetchTasks();
  };

  const toggleTask = async (task: Task) => {
    await fetch(`${API}/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;

  return (
    <div className="container">
      <header>
        <h1>Gestor de Tareas</h1>
        <p className="subtitle">Project CI - Integración Continua</p>
      </header>

      <div className="stats">
        <div className="stat pending">
          <span className="stat-number">{pending}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat done">
          <span className="stat-number">{completed}</span>
          <span className="stat-label">Completadas</span>
        </div>
        <div className="stat total">
          <span className="stat-number">{tasks.length}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      <div className="input-row">
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Nueva tarea..."
        />
        <button onClick={addTask}>+ Agregar</button>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p className="empty">No hay tareas. ¡Crea la primera!</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={task.completed ? 'task completed' : 'task'}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />
              <span className="task-title">{task.title}</span>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
