const express = require('express');
const router = express.Router();
const {
  verifyToken,
  getCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');

// Protected routes (require JWT)
router.get('/certificates', verifyToken, getCertificates);
router.get('/certificates/:id', verifyToken, getCertificate);
router.post('/certificates', verifyToken, createCertificate);
router.put('/certificates/:id', verifyToken, updateCertificate);
router.delete('/certificates/:id', verifyToken, deleteCertificate);

module.exports = router;