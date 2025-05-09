const express = require('express');
const router = express.Router();
const {
  verifyToken,
  getAttendances,
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');

// Protected routes (require JWT)
router.get('/attendance', verifyToken, getAttendances);
router.get('/attendance/:id', verifyToken, getAttendance);
router.post('/attendance', verifyToken, createAttendance);
router.put('/attendance/:id', verifyToken, updateAttendance);
router.delete('/attendance/:id', verifyToken, deleteAttendance);

module.exports = router;