// D:\tharun\New folder\mongapi\netlify\functions\admins.js
const {
  verifyToken,
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require('../../controllers/adminController');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'https://tmcybertech.netlify.app',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Parse the event.body string into a JavaScript object
  let parsedBody;
  try {
    parsedBody = event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid request body: Malformed JSON' }),
    };
  }

  const req = {
    body: parsedBody,
    headers: event.headers,
    params: {},
  };

  let statusCode = 200;
  let body = '';

  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      body = JSON.stringify(data);
      return res;
    },
  };

  // Extract ID from path if present
  const pathParts = event.path.split('/');
  if (pathParts.length > 3) {
    req.params.id = pathParts[3];
  }

  // Map HTTP methods to controller functions
  if (event.httpMethod === 'GET' && !req.params.id) {
    await verifyToken(req, res, async () => await getAdmins(req, res));
  } else if (event.httpMethod === 'GET' && req.params.id) {
    await verifyToken(req, res, async () => await getAdmin(req, res));
  } else if (event.httpMethod === 'POST') {
    await verifyToken(req, res, async () => await createAdmin(req, res));
  } else if (event.httpMethod === 'PUT' && req.params.id) {
    await verifyToken(req, res, async () => await updateAdmin(req, res));
  } else if (event.httpMethod === 'DELETE' && req.params.id) {
    await verifyToken(req, res, async () => await deleteAdmin(req, res));
  } else {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  return {
    statusCode,
    headers,
    body,
  };
};