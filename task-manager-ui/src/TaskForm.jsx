import { useState } from 'react';

const STATUSES = [
  { value: 'Todo', label: 'To do' },
  { value: 'InProgress', label: 'In progress' },
  { value: 'Done', label: 'Done' },
];

export default function TaskForm({ task, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'Todo',
    AssignedTo: task?.AssignedTo ?? '',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    const title = form.title.trim();
    if (!title) e.title = 'Title is required.';
    else if (title.length < 3 || title.length > 100)
      e.title = 'Title must be 3-100 characters.';
    if (form.description.length > 500)
      e.description = 'Description can be at most 500 characters.';
    if (!form.AssignedTo.trim()) e.AssignedTo = 'Assigned To is required.';
    if (!form.dueDate) e.dueDate = 'Due date is required.';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setServerError('');
    if (Object.keys(e).length > 0) return;

    setSaving(true);
    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        AssignedTo: form.AssignedTo.trim(),
        dueDate: `${form.dueDate}T00:00:00Z`,
      });
    } catch (err) {
      setServerError(err.message);
      setSaving(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <h2>{task ? 'Edit task' : 'Add new task'}</h2>

      {serverError && <div className="alert">{serverError}</div>}

      <label>
        Title *
        <input name="title" value={form.title} onChange={change} />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>

      <label>
        Description
        <textarea name="description" rows="3" value={form.description} onChange={change} />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </label>

      <label>
        Status
        <select name="status" value={form.status} onChange={change}>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>

      <label>
        AssignedTo *
        <input name="AssignedTo" value={form.AssignedTo} onChange={change} />
        {errors.AssignedTo && <span className="field-error">{errors.AssignedTo}</span>}
      </label>

      <label>
        Due date *
        <input type="date" name="dueDate" value={form.dueDate} onChange={change} />
        {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
      </label>

      <div className="actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : task ? 'Save changes' : 'Add task'}
        </button>
        <button type="button" className="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}