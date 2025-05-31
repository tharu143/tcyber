const express = require('express');
const router = express.Router();
const License = require('../models/License');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/list', verifyToken, async (req, res) => {
  try {
    const licenses = await License.find().select('licenseNumber name deviceId isApproved createdAt');
    res.status(200).json(licenses);
  } catch (error) {
    console.error('Error fetching licenses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;