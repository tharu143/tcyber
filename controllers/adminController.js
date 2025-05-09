const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const {
  getAdminByEmail,
  getAllAdmins,
  getAdminById,
  createAdmin: createAdminModel,
  updateAdmin: updateAdminModel,
  deleteAdmin: deleteAdminModel, // Renamed to avoid conflict
} = require('../models/admins');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await getAdminByEmail(email);
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: admin.email, id: admin._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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

const getAdmins = async (req, res) => {
  try {
    const admins = await getAllAdmins();
    res.status(200).json(admins.map(admin => ({
      id: admin._id.toString(),
      email: admin.email,
      created_at: admin.created_at,
    })));
  } catch (err) {
    console.error('Get admins error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid admin ID' });
    }

    const admin = await getAdminById(id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({
      id: admin._id.toString(),
      email: admin.email,
      created_at: admin.created_at,
    });
  } catch (err) {
    console.error('Get admin error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingAdmin = await getAdminByEmail(email);
    if (existingAdmin) {
      return res.status(409).json({ error: 'Admin with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = {
      email,
      password_hash: passwordHash,
      created_at: new Date(),
    };

    const admin = await createAdminModel(newAdmin);
    res.status(201).json({
      id: admin._id.toString(),
      email: admin.email,
      created_at: admin.created_at,
    });
  } catch (err) {
    console.error('Create admin error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid admin ID' });
    }

    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(400).json({ error: 'At least one field (email or password) is required to update' });
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password_hash = await bcrypt.hash(password, 10);

    const updated = await updateAdminModel(id, updateData);
    if (!updated) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin updated successfully' });
  } catch (err) {
    console.error('Update admin error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid admin ID' });
    }

    const deleted = await deleteAdminModel(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error('Delete admin error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  login,
  verifyToken,
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};