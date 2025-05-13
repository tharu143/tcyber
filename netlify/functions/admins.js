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

  const req = {
    body: event.body,
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