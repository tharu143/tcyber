const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const {
  getAllAttendance,
  getAttendanceById,
  createAttendance: createAttendanceModel,
  updateAttendance: updateAttendanceModel, // Renamed to avoid conflict
  deleteAttendance: deleteAttendanceModel, // Renamed to avoid conflict
  getEmployeeById,
} = require('../models/attendance');

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

const getAttendances = async (req, res) => {
  try {
    const attendanceRecords = await getAllAttendance();
    res.status(200).json(attendanceRecords.map(record => ({
      ...record,
      id: record.id.toString(),
      employee_id: record.employee_id.toString(),
    })));
  } catch (err) {
    console.error('Get attendances error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid attendance ID' });
    }

    const attendanceRecord = await getAttendanceById(id);
    if (!attendanceRecord) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.status(200).json({
      ...attendanceRecord,
      id: attendanceRecord.id.toString(),
      employee_id: attendanceRecord.employee_id.toString(),
    });
  } catch (err) {
    console.error('Get attendance error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createAttendance = async (req, res) => {
  try {
    const { employee_id, date, status } = req.body;
    if (!employee_id || !date || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const employee = await getEmployeeById(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const newAttendance = {
      employee_id: new ObjectId(employee_id),
      date: new Date(date),
      status,
      created_at: new Date(),
    };

    const attendance = await createAttendanceModel(newAttendance);
    res.status(201).json({
      id: attendance._id.toString(),
      employee_id: employee_id,
      employee_name: employee.name,
      date: attendance.date,
      status: attendance.status,
      created_at: attendance.created_at,
    });
  } catch (err) {
    console.error('Create attendance error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid attendance ID' });
    }

    const { employee_id, date, status } = req.body;
    if (!employee_id || !date || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const employee = await getEmployeeById(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updateFields = {
      employee_id: new ObjectId(employee_id),
      date: new Date(date),
      status,
    };

    const updatedAttendance = await updateAttendanceModel(id, updateFields); // Use the renamed model function
    if (!updatedAttendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.status(200).json({
      id: updatedAttendance._id.toString(),
      employee_id: updatedAttendance.employee_id.toString(),
      employee_name: employee.name,
      date: updatedAttendance.date,
      status: updatedAttendance.status,
      created_at: updatedAttendance.created_at,
    });
  } catch (err) {
    console.error('Update attendance error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid attendance ID' });
    }

    const deleted = await deleteAttendanceModel(id); // Use the renamed model function
    if (!deleted) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    console.error('Delete attendance error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  verifyToken,
  getAttendances,
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};