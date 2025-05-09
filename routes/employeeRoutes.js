const express = require('express');
const router = express.Router();
const {
  verifyToken,
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

// Protected routes (require JWT)
router.get('/employees', verifyToken, getEmployees);
router.get('/employees/:id', verifyToken, getEmployee);
router.post('/employees', verifyToken, createEmployee);
router.put('/employees/:id', verifyToken, updateEmployee);
router.delete('/employees/:id', verifyToken, deleteEmployee);

module.exports = router;