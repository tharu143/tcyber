const express = require('express');
const router = express.Router();
const {
  verifyToken,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// Protected routes (require JWT)
router.get('/tasks', verifyToken, getTasks);
router.get('/tasks/:id', verifyToken, getTask);
router.post('/tasks', verifyToken, createTask);
router.put('/tasks/:id', verifyToken, updateTask);
router.delete('/tasks/:id', verifyToken, deleteTask);

module.exports = router;