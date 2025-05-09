const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee: createEmployeeModel, // Renamed to avoid conflict
  updateEmployee: updateEmployeeModel, // Renamed to avoid conflict
  deleteEmployee: deleteEmployeeModel, // Renamed to avoid conflict
} = require('../models/employee');

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

const getEmployees = async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json(employees.map(employee => ({
      id: employee._id.toString(),
      name: employee.name,
      email: employee.email,
      position: employee.position,
      joining_date: employee.joining_date,
      salary: employee.salary,
      created_at: employee.created_at,
    })));
  } catch (err) {
    console.error('Get employees error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const employee = await getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({
      id: employee._id.toString(),
      name: employee.name,
      email: employee.email,
      position: employee.position,
      joining_date: employee.joining_date,
      salary: employee.salary,
      created_at: employee.created_at,
    });
  } catch (err) {
    console.error('Get employee error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, email, position, joining_date, salary } = req.body;
    if (!name || !email || !position || !joining_date || !salary) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newEmployee = {
      name,
      email,
      position,
      joining_date: new Date(joining_date),
      salary: parseFloat(salary),
      created_at: new Date(),
    };

    const employee = await createEmployeeModel(newEmployee);
    res.status(201).json({
      id: employee._id.toString(),
      name: employee.name,
      email: employee.email,
      position: employee.position,
      joining_date: employee.joining_date,
      salary: employee.salary,
      created_at: employee.created_at,
    });
  } catch (err) {
    console.error('Create employee error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const { name, email, position, joining_date, salary } = req.body;
    if (!name || !email || !position || !joining_date || !salary) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updateFields = {
      name,
      email,
      position,
      joining_date: new Date(joining_date),
      salary: parseFloat(salary),
    };

    const updatedEmployee = await updateEmployeeModel(id, updateFields);
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({
      id: updatedEmployee._id.toString(),
      name: updatedEmployee.name,
      email: updatedEmployee.email,
      position: updatedEmployee.position,
      joining_date: updatedEmployee.joining_date,
      salary: updatedEmployee.salary,
      created_at: updatedEmployee.created_at,
    });
  } catch (err) {
    console.error('Update employee error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const deleted = await deleteEmployeeModel(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Delete employee error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  verifyToken,
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};