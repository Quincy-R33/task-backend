const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// GET all tasks for logged in user
router.get('/', verifyToken, (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.user.id);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get tasks', error: err.message });
  }
});

// GET single task by id
router.get('/:id', verifyToken, (req, res) => {
  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get task', error: err.message });
  }
});

// ADD new task
router.post('/', verifyToken, (req, res) => {
  const { title, description } = req.body;
  try {
    db.prepare('INSERT INTO tasks (title, description, completed, user_id) VALUES (?, ?, 0, ?)')
      .run(title, description, req.user.id);
    res.status(201).json({ message: 'Task created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
});

// UPDATE task
router.put('/:id', verifyToken, (req, res) => {
  const { title, description, completed } = req.body;
  try {
    db.prepare('UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?')
      .run(title, description, completed, req.params.id, req.user.id);
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
});

// DELETE task
router.delete('/:id', verifyToken, (req, res) => {
  try {
    db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
});

// TOGGLE complete
router.patch('/:id/toggle', verifyToken, (req, res) => {
  try {
    db.prepare('UPDATE tasks SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);
    res.json({ message: 'Task toggled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle task', error: err.message });
  }
});

module.exports = router;