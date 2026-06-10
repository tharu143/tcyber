const {
    verifyToken,
    getAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
  } = require('../../controllers/adminController');
  
const { getCorsHeaders } = require('../../utils/cors');
  
  exports.handler = async (event, context) => {
    const headers = getCorsHeaders(event);
  
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