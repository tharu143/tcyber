const express = require('express');
const router = express.Router();
const {
  login,
  verifyToken,
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/adminController');

// Public route
router.post('/login', login);

// Protected routes (require JWT)
router.get('/admins', verifyToken, getAdmins);
router.get('/admins/:id', verifyToken, getAdmin);
router.post('/admins', verifyToken, createAdmin);
router.put('/admins/:id', verifyToken, updateAdmin);
router.delete('/admins/:id', verifyToken, deleteAdmin);

module.exports = router;