const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const {
  getAllCertificates,
  getCertificateById,
  createCertificate: createCertificateModel, // Renamed to avoid conflict
  updateCertificate: updateCertificateModel, // Renamed to avoid conflict
  deleteCertificate: deleteCertificateModel, // Renamed to avoid conflict
} = require('../models/certificate');

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

const getCertificates = async (req, res) => {
  try {
    const certificates = await getAllCertificates();
    res.status(200).json(certificates.map(certificate => ({
      id: certificate._id.toString(),
      name: certificate.name,
      start_date: certificate.start_date,
      end_date: certificate.end_date,
      type: certificate.type,
      created_at: certificate.created_at,
    })));
  } catch (err) {
    console.error('Get certificates error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid certificate ID' });
    }

    const certificate = await getCertificateById(id);
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.status(200).json({
      id: certificate._id.toString(),
      name: certificate.name,
      start_date: certificate.start_date,
      end_date: certificate.end_date,
      type: certificate.type,
      created_at: certificate.created_at,
    });
  } catch (err) {
    console.error('Get certificate error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createCertificate = async (req, res) => {
  try {
    const { name, start_date, end_date, type } = req.body;
    if (!name || !start_date || !end_date || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newCertificate = {
      name,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      type,
      created_at: new Date(),
    };

    const certificate = await createCertificateModel(newCertificate);
    res.status(201).json({
      id: certificate._id.toString(),
      name: certificate.name,
      start_date: certificate.start_date,
      end_date: certificate.end_date,
      type: certificate.type,
      created_at: certificate.created_at,
    });
  } catch (err) {
    console.error('Create certificate error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid certificate ID' });
    }

    const { name, start_date, end_date, type } = req.body;
    if (!name || !start_date || !end_date || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updateFields = {
      name,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      type,
    };

    const updatedCertificate = await updateCertificateModel(id, updateFields);
    if (!updatedCertificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.status(200).json({
      id: updatedCertificate._id.toString(),
      name: updatedCertificate.name,
      start_date: updatedCertificate.start_date,
      end_date: updatedCertificate.end_date,
      type: updatedCertificate.type,
      created_at: updatedCertificate.created_at,
    });
  } catch (err) {
    console.error('Update certificate error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid certificate ID' });
    }

    const deleted = await deleteCertificateModel(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (err) {
    console.error('Delete certificate error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  verifyToken,
  getCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};