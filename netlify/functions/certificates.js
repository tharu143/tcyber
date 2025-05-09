const {
    verifyToken,
    getCertificates,
    getCertificate,
    createCertificate,
    updateCertificate,
    deleteCertificate,
  } = require('../../controllers/certificateController');
  
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
  
    const req = {
      body: event.body,
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
      await verifyToken(req, res, async () => await getCertificates(req, res));
    } else if (event.httpMethod === 'GET' && req.params.id) {
      await verifyToken(req, res, async () => await getCertificate(req, res));
    } else if (event.httpMethod === 'POST') {
      await verifyToken(req, res, async () => await createCertificate(req, res));
    } else if (event.httpMethod === 'PUT' && req.params.id) {
      await verifyToken(req, res, async () => await updateCertificate(req, res));
    } else if (event.httpMethod === 'DELETE' && req.params.id) {
      await verifyToken(req, res, async () => await deleteCertificate(req, res));
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