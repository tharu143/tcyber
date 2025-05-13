// D:\tharun\New folder\mongapi\netlify\functions\login.js
const { login } = require('../../controllers/adminController');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'https://tmcybertech.netlify.app',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    // Log the incoming request for debugging
    console.log('Incoming event:', event);

    // Parse the event.body string into a JavaScript object
    let parsedBody;
    try {
      parsedBody = event.body ? JSON.parse(event.body) : {};
    } catch (error) {
      console.error('Error parsing event.body:', error.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request body: Malformed JSON' }),
      };
    }

    // Log the parsed body
    console.log('Parsed body:', parsedBody);

    const req = {
      body: parsedBody,
      headers: event.headers,
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

    // Call the login function
    await login(req, res);

    return {
      statusCode,
      headers,
      body,
    };
  } catch (error) {
    // Log any unhandled errors
    console.error('Function error:', error.message, error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};