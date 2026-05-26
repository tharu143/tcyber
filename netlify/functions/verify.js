const { verifyToken } = require('../../controllers/adminController');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let headers = {
    'Access-Control-Allow-Origin': 'https://tmcybertech.netlify.app',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  try {
    const allowedOrigins = [
      'https://tmcybertech.netlify.app',
      'https://tmcybertech.in',
      'https://www.tmcybertech.in',
      'http://localhost:5173'
    ];
    
    const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
    const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    headers['Access-Control-Allow-Origin'] = allowOrigin;

    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const req = {
      headers: event.headers || {},
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

    await verifyToken(req, res, () => {
      res.status(200).json({ valid: true });
    });

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