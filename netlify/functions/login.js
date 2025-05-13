// D:\tharun\New folder\mongapi\netlify\functions\login.js
const { login } = require('../../controllers/adminController');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'https://tmcybertech.netlify.app',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
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

  await login(req, res);

  return {
    statusCode,
    headers,
    body,
  };
};