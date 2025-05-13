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

// Token verification route
router.get('/verify', verifyToken, (req, res) => {
  res.json({ valid: true });
});

// Protected routes (require JWT)
router.get('/admins', verifyToken, getAdmins); // Fixed: Removed 'gaan' and corrected syntax
router.get('/admins/:id', verifyToken, getAdmin);
router.post('/admins', verifyToken, createAdmin);
router.put('/admins/:id', verifyToken, updateAdmin);
router.delete('/admins/:id', verifyToken, deleteAdmin);

module.exports = router;