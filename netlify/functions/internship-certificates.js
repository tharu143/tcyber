const { 
  verifyToken, 
  getInternshipCertificates, 
  createInternshipCertificate, 
  updateInternshipCertificate, 
  deleteInternshipCertificate, 
  getPublicInternshipCertificate 
} = require('../../controllers/internshipCertificateController');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const allowedOrigins = [
    'https://tmcybertech.netlify.app',
    'https://tmcybertech.in',
    'https://www.tmcybertech.in',
    'http://localhost:5173'
  ];
  
  const origin = event.headers.origin || event.headers.Origin;
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const headers = {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  const startTime = Date.now();
  try {
    if (event.httpMethod === 'OPTIONS') {
      console.log(`OPTIONS request completed in ${Date.now() - startTime}ms`);
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    const req = {
      headers: event.headers,
      params: {},
      body: event.body ? JSON.parse(event.body) : {},
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

    const pathParts = event.path.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    // Check if it's a public verification request
    const isPublic = event.path.includes('/public/');

    if (lastPart && lastPart !== 'internship-certificates') {
      req.params.id = lastPart;
    }

    if (isPublic) {
      // Public route: no token required
      if (event.httpMethod === 'GET' && req.params.id) {
        await getPublicInternshipCertificate(req, res);
      } else {
        statusCode = 405;
        body = JSON.stringify({ error: 'Method not allowed on public endpoint' });
      }
    } else {
      // Protected admin routes: requires JWT verification
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };
      
      await verifyToken(req, res, next);
      
      if (!nextCalled) {
        console.log(`Token verification failed in ${Date.now() - startTime}ms`);
        statusCode = statusCode || 401;
        body = JSON.stringify({ error: 'Unauthorized or invalid token' });
        return {
          statusCode,
          headers,
          body,
        };
      }

      if (event.httpMethod === 'GET' && !req.params.id) {
        await getInternshipCertificates(req, res);
        if (!body) {
          body = JSON.stringify([]);
        }
      } else if (event.httpMethod === 'POST') {
        await createInternshipCertificate(req, res);
      } else if (event.httpMethod === 'PUT' && req.params.id) {
        await updateInternshipCertificate(req, res);
      } else if (event.httpMethod === 'DELETE' && req.params.id) {
        await deleteInternshipCertificate(req, res);
      } else {
        statusCode = 405;
        body = JSON.stringify({ error: 'Method not allowed' });
      }
    }

    console.log(`Internship certificates request completed in ${Date.now() - startTime}ms`);
    return {
      statusCode,
      headers,
      body,
    };
  } catch (error) {
    console.error('Function error:', error.message, error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
