const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const License = require('../../models/License'); // Adjusted path
const { sendApprovalEmail } = require('../../utils/email'); // Adjusted path

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'https://tmcybertech.netlify.app',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Connect to MongoDB
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database connection failed' }),
    };
  }

  const path = event.path;
  const body = JSON.parse(event.body || '{}');

  try {
    // Register a new license
    if (path.endsWith('/license/register')) {
      const { name, deviceId } = body;

      if (!name || !deviceId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Name and deviceId are required' }),
        };
      }

      const existingLicense = await License.findOne({ deviceId });
      if (existingLicense) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Device already registered with a license' }),
        };
      }

      const licenseNumber = uuidv4();
      const license = new License({
        licenseNumber,
        name,
        deviceId,
        isApproved: false,
      });

      await license.save();
      await sendApprovalEmail(licenseNumber, name, deviceId, process.env.ADMIN_EMAIL);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: 'License request sent. Waiting for admin approval.', licenseNumber }),
      };
    }

    // Verify a license
    if (path.endsWith('/license/verify')) {
      const { licenseNumber, deviceId } = body;

      if (!licenseNumber || !deviceId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'LicenseNumber and deviceId are required' }),
        };
      }

      const license = await License.findOne({ licenseNumber });
      if (!license) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'License not found' }),
        };
      }

      if (!license.isApproved) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ message: 'License not approved' }),
        };
      }

      if (license.deviceId !== deviceId) {
        await sendApprovalEmail(licenseNumber, license.name, deviceId, process.env.ADMIN_EMAIL);
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ message: 'Unauthorized device' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'License verified', name: license.name }),
      };
    }

    // Approve a license
    if (path.endsWith('/license/approve')) {
      const { licenseNumber } = body;

      if (!licenseNumber) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'LicenseNumber is required' }),
        };
      }

      const license = await License.findOne({ licenseNumber });
      if (!license) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'License not found' }),
        };
      }

      license.isApproved = true;
      await license.save();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'License approved' }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Route not found' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};