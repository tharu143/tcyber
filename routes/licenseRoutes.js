const express = require('express');
const router = express.Router();
const License = require('../models/License');
const { sendApprovalEmail } = require('../utils/email');
const { v4: uuidv4 } = require('uuid');

// Register a new license
router.post('/license/register', async (req, res) => {
  const { name, deviceId } = req.body;

  try {
    // Check if device is already registered
    const existingLicense = await License.findOne({ deviceId });
    if (existingLicense) {
      return res.status(400).json({ message: 'Device already registered with a license.' });
    }

    // Generate unique license number
    const licenseNumber = uuidv4();

    // Create new license entry (unapproved)
    const license = new License({
      licenseNumber,
      name,
      deviceId,
      isApproved: false,
    });

    await license.save();

    // Send approval email to admin
    await sendApprovalEmail(licenseNumber, name, deviceId, process.env.ADMIN_EMAIL);

    res.status(201).json({ message: 'License request sent. Waiting for admin approval.', licenseNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve a license
router.post('/license/approve', async (req, res) => {
  const { licenseNumber } = req.body;

  try {
    const license = await License.findOne({ licenseNumber });
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    license.isApproved = true;
    await license.save();

    res.status(200).json({ message: 'License approved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify license
router.post('/license/verify', async (req, res) => {
  const { licenseNumber, deviceId } = req.body;

  try {
    const license = await License.findOne({ licenseNumber });
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    if (!license.isApproved) {
      return res.status(403).json({ message: 'License not approved' });
    }

    if (license.deviceId !== deviceId) {
      // Notify admin of unauthorized access attempt
      await sendApprovalEmail(licenseNumber, license.name, deviceId, process.env.ADMIN_EMAIL);
      return res.status(403).json({ message: 'Unauthorized device' });
    }

    res.status(200).json({ message: 'License verified', name: license.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;