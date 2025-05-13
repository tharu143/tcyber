const { verifyToken, getCertificates, getCertificate, createCertificate, updateCertificate, deleteCertificate } = require('../../controllers/certificateController');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'https://tmcybertech.netlify.app',
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
    if (pathParts.length > 3) {
      req.params.id = pathParts[pathParts.length - 1];
    }

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
      await getCertificates(req, res);
      if (!body) {
        console.log('No certificates found');
        body = JSON.stringify([]);
      }
    } else if (event.httpMethod === 'GET' && req.params.id) {
      await getCertificate(req, res);
    } else if (event.httpMethod === 'POST') {
      await createCertificate(req, res);
    } else if (event.httpMethod === 'PUT' && req.params.id) {
      await updateCertificate(req, res);
    } else if (event.httpMethod === 'DELETE' && req.params.id) {
      await deleteCertificate(req, res);
    } else {
      statusCode = 405;
      body = JSON.stringify({ error: 'Method not allowed' });
    }

    console.log(`Certificates request completed in ${Date.now() - startTime}ms, Response body: ${body}`);
    return {
      statusCode,
      headers,
      body,
    };
  } catch (error) {
    console.error('Function error:', error.message, error.stack);
    console.log(`Error response sent in ${Date.now() - startTime}ms`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};