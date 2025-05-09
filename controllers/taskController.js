const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const {
  getAllTasks,
  getTaskById,
  createTask: createTaskModel, // Renamed to avoid conflict
  updateTask: updateTaskModel, // Renamed to avoid conflict
  deleteTask: deleteTaskModel, // Renamed to avoid conflict
  getEmployeeById,
} = require('../models/task');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks.map(task => ({
      ...task,
      id: task.id.toString(),
      employee_id: task.employee_id.toString(),
    })));
  } catch (err) {
    console.error('Get tasks error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({
      ...task,
      id: task.id.toString(),
      employee_id: task.employee_id.toString(),
    });
  } catch (err) {
    console.error('Get task error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { employee_id, title, description, status, due_date } = req.body;
    if (!employee_id || !title || !description || !status || !due_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const employee = await getEmployeeById(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const newTask = {
      employee_id: new ObjectId(employee_id),
      title,
      description,
      status,
      due_date: new Date(due_date),
      created_at: new Date(),
    };

    const task = await createTaskModel(newTask);
    res.status(201).json({
      id: task._id.toString(),
      employee_id: employee_id,
      employee_name: employee.name,
      title: task.title,
      description: task.description,
      status: task.status,
      due_date: task.due_date,
      created_at: task.created_at,
    });
  } catch (err) {
    console.error('Create task error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const { employee_id, title, description, status, due_date } = req.body;
    if (!employee_id || !title || !description || !status || !due_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const employee = await getEmployeeById(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updateFields = {
      employee_id: new ObjectId(employee_id),
      title,
      description,
      status,
      due_date: new Date(due_date),
    };

    const updatedTask = await updateTaskModel(id, updateFields);
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({
      id: updatedTask._id.toString(),
      employee_id: updatedTask.employee_id.toString(),
      employee_name: employee.name,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      due_date: updatedTask.due_date,
      created_at: updatedTask.created_at,
    });
  } catch (err) {
    console.error('Update task error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const deleted = await deleteTaskModel(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  verifyToken,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};