const { tasks } = require('../utils/store');

function listTasks(req, res) {
  const userTasks = tasks.filter((task) => task.userId === req.user.id);
  res.json(userTasks);
}

function createTask(req, res) {
  const { title, description, priority, dueDate } = req.body;

  if (!title || !description || !priority || !dueDate) {
    return res.status(400).json({ message: 'Please complete all task fields.' });
  }

  const task = {
    id: Date.now().toString(),
    userId: req.user.id,
    title: title.trim(),
    description: description.trim(),
    status: 'Pending',
    priority,
    dueDate,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
}

function updateTask(req, res) {
  const { title, description, priority, dueDate, status } = req.body;
  const task = tasks.find((entry) => entry.id === req.params.id && entry.userId === req.user.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.priority = priority || task.priority;
  task.dueDate = dueDate || task.dueDate;
  task.status = status || task.status;

  res.json(task);
}

function deleteTask(req, res) {
  const taskIndex = tasks.findIndex((entry) => entry.id === req.params.id && entry.userId === req.user.id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted.' });
}

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
};
