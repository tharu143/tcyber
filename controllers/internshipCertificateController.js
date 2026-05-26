const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const {
  getAllInternshipCertificates,
  getInternshipCertificateById,
  createInternshipCertificate: createModel,
  updateInternshipCertificate: updateModel,
  deleteInternshipCertificate: deleteModel,
} = require('../models/internshipCertificate');

// JWT verification middleware
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

// Admin handlers
const getInternshipCertificates = async (req, res) => {
  try {
    const certificates = await getAllInternshipCertificates();
    res.status(200).json(certificates.map(c => ({
      id: c._id.toString(),
      name: c.name,
      start_date: c.start_date,
      end_date: c.end_date,
      domain: c.domain,
      company: c.company || 'tmcybertech',
      contact: c.contact || '+91 63813 60779',
      website: c.website || 'https://tmcybertech.in/',
      created_at: c.created_at,
    })));
  } catch (err) {
    console.error('Get internship certificates error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createInternshipCertificate = async (req, res) => {
  try {
    const { name, start_date, end_date, domain, company, contact, website } = req.body;
    if (!name || !start_date || !end_date || !domain) {
      return res.status(400).json({ error: 'Student name, start date, end date, and domain are required' });
    }

    const newCertificate = {
      name,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      domain,
      company: company || 'tmcybertech',
      contact: contact || '+91 63813 60779',
      website: website || 'https://tmcybertech.in/',
      created_at: new Date(),
    };

    const certificate = await createModel(newCertificate);
    res.status(201).json({
      id: certificate._id.toString(),
      name: certificate.name,
      start_date: certificate.start_date,
      end_date: certificate.end_date,
      domain: certificate.domain,
      company: certificate.company,
      contact: certificate.contact,
      website: certificate.website,
      created_at: certificate.created_at,
    });
  } catch (err) {
    console.error('Create internship certificate error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateInternshipCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid certificate ID' });
    }

    const { name, start_date, end_date, domain, company, contact, website } = req.body;
    if (!name || !start_date || !end_date || !domain) {
      return res.status(400).json({ error: 'Student name, start date, end date, and domain are required' });
    }

    const updateFields = {
      name,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      domain,
      company: company || 'tmcybertech',
      contact: contact || '+91 63813 60779',
      website: website || 'https://tmcybertech.in/',
    };

    const updated = await updateModel(id, updateFields);
    if (!updated) {
      return res.status(404).json({ error: 'Internship certificate not found' });
    }

    res.status(200).json({
      id: updated._id.toString(),
      name: updated.name,
      start_date: updated.start_date,
      end_date: updated.end_date,
      domain: updated.domain,
      company: updated.company,
      contact: updated.contact,
      website: updated.website,
      created_at: updated.created_at,
    });
  } catch (err) {
    console.error('Update internship certificate error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteInternshipCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid certificate ID' });
    }

    const deleted = await deleteModel(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Internship certificate not found' });
    }

    res.status(200).json({ message: 'Internship certificate deleted successfully' });
  } catch (err) {
    console.error('Delete internship certificate error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Public verification handler (No JWT validation required)
const getPublicInternshipCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid certificate ID' });
    }

    const certificate = await getInternshipCertificateById(id);
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.status(200).json({
      id: certificate._id.toString(),
      name: certificate.name,
      start_date: certificate.start_date,
      end_date: certificate.end_date,
      domain: certificate.domain,
      company: certificate.company || 'tmcybertech',
      contact: certificate.contact || '+91 63813 60779',
      website: certificate.website || 'https://tmcybertech.in/',
      created_at: certificate.created_at,
    });
  } catch (err) {
    console.error('Get public internship certificate error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  verifyToken,
  getInternshipCertificates,
  createInternshipCertificate,
  updateInternshipCertificate,
  deleteInternshipCertificate,
  getPublicInternshipCertificate,
};
