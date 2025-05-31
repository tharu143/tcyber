const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  licenseNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  deviceId: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('License', licenseSchema);