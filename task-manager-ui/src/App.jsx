import { useCallback, useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskForm from './TaskForm';
import './App.css';

const LABELS = { Todo: 'To do', InProgress: 'In progress', Done: 'Done' };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTasks(await getTasks(filter));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (data) => {
    if (editing) await updateTask(editing.id, data);
    else await createTask(data);
    closeForm();
    await load();
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) return;
    try {
      await deleteTask(task.id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const openAdd = () => { setEditing(null); setShowForm(true); };
  const openEdit = (task) => { setEditing(task); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  return (
    <main className="container">
      <header className="top">
        <h1>Task Manager</h1>
        <button onClick={openAdd}>+ Add task</button>
      </header>

      {showForm && (
        <TaskForm
          key={editing?.id ?? 'new'}
          task={editing}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}

      <div className="filter">
        <label>
          Filter by status:{' '}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Todo">To do</option>
            <option value="InProgress">In progress</option>
            <option value="Done">Done</option>
          </select>
        </label>
      </div>

      {error && (
        <div className="alert">
          {error} <button className="link" onClick={load}>Try again</button>
        </div>
      )}

      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : tasks.length === 0 && !error ? (
        <p className="empty">
          {filter ? 'No tasks with this status.' : 'No tasks yet. Click "Add task" to create your first one.'}
        </p>
      ) : (
        <ul className="list">
          {tasks.map((t) => (
            <li key={t.id} className="card task">
              <div className="task-info">
                <h3>{t.title}</h3>
                {t.description && <p>{t.description}</p>}
                <p className="meta">
                  <span className={`badge ${t.status}`}>{LABELS[t.status]}</span>
                  {' '}AssignedTo: {t.AssignedTo} · Due: {t.dueDate.slice(0, 10)}
                </p>
              </div>
              <div className="actions">
                <button className="secondary" onClick={() => openEdit(t)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(t)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}