// D:\tharun\New folder\mongapi\netlify\functions\test-mongo.js
const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'https://tmcybertech.netlify.app',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const uri = process.env.MONGO_URI || 'mongodb+srv://tmcyber:Tharun143%40@tm.bupjtnt.mongodb.net/tmcyber';
    const client = new MongoClient(uri);

    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('tmcyber');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections);

    await client.close();
    console.log('MongoDB connection closed');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'MongoDB connection successful', collections: collections.map(c => c.name) }),
    };
  } catch (error) {
    console.error('MongoDB connection error:', error.message, error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to connect to MongoDB', details: error.message }),
    };
  }
};