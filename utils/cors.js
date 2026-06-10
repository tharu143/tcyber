const allowedOrigins = [
  'https://tmcybertech.netlify.app',
  'https://tmcybertech.in',
  'https://www.tmcybertech.in',
  'http://localhost:5173'
];

function getCorsHeaders(event) {
  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  
  let allowOrigin = 'https://tmcybertech.netlify.app';
  
  if (origin) {
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(cleanOrigin)) {
      allowOrigin = cleanOrigin;
    }
  } else if (process.env.FRONTEND_URL) {
    allowOrigin = process.env.FRONTEND_URL.replace(/\/+$/, '');
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

module.exports = { getCorsHeaders };
