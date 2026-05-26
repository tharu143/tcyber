const express = require('express');
const router = express.Router();
const {
  verifyToken,
  getInternshipCertificates,
  createInternshipCertificate,
  updateInternshipCertificate,
  deleteInternshipCertificate,
  getPublicInternshipCertificate,
} = require('../controllers/internshipCertificateController');

// Protected admin routes (require JWT)
router.get('/internship-certificates', verifyToken, getInternshipCertificates);
router.post('/internship-certificates', verifyToken, createInternshipCertificate);
router.put('/internship-certificates/:id', verifyToken, updateInternshipCertificate);
router.delete('/internship-certificates/:id', verifyToken, deleteInternshipCertificate);

// Public verification route (does not require auth token)
router.get('/public/internship-certificates/:id', getPublicInternshipCertificate);

module.exports = router;
