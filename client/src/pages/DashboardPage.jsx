import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const initialForm = { title: '', description: '', priority: 'Medium', dueDate: '' };

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'Completed').length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, form);
        setMessage('Task updated successfully.');
      } else {
        await api.post('/tasks', form);
        setMessage('Task created successfully.');
      }
      resetForm();
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save task.');
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
    });
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setMessage('Task deleted.');
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete task.');
    }
  };

  const toggleStatus = async (task) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        ...task,
        status: task.status === 'Completed' ? 'Pending' : 'Completed',
      });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update status.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">TaskFlow</p>
            <h1 className="text-xl font-semibold text-slate-900">Welcome back, {user?.name}</h1>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-500 hover:text-sky-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Total Tasks', value: stats.total, accent: 'from-sky-500 to-blue-600' },
            { title: 'Completed', value: stats.completed, accent: 'from-emerald-500 to-green-600' },
            { title: 'Pending', value: stats.pending, accent: 'from-amber-500 to-orange-500' },
          ].map((card) => (
            <div key={card.title} className={`rounded-3xl bg-gradient-to-br ${card.accent} p-5 text-white shadow-lg`}>
              <p className="text-sm font-medium text-white/80">{card.title}</p>
              <p className="mt-3 text-3xl font-semibold">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
                <p className="text-sm text-slate-500">Search, filter, and manage your work.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title"
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500">
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500">
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {message && <p className="mb-3 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-600">{message}</p>}
            {error && <p className="mb-3 rounded-2xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

            {loading ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">Loading your tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                No tasks match your current filters. Add a new task to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="rounded-2xl border border-slate-200 p-4 transition hover:shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{task.title}</h3>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{task.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1">Priority: {task.priority}</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1">Due: {task.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => toggleStatus(task)} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                          {task.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
                        </button>
                        <button onClick={() => handleEdit(task)} className="rounded-full bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(task.id)} className="rounded-full bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Task' : 'Create Task'}</h2>
              <p className="text-sm text-slate-500">Keep your workload structured and visible.</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 outline-none focus:border-sky-500" placeholder="Prepare sprint review" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="4" className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 outline-none focus:border-sky-500" placeholder="Add notes for the task" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
                  <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 outline-none focus:border-sky-500">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Due Date</label>
                  <input type="date" required value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 outline-none focus:border-sky-500" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="rounded-2xl bg-sky-600 px-4 py-2.5 font-semibold text-white transition hover:bg-sky-700">
                  {editingId ? 'Save Changes' : 'Add Task'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
