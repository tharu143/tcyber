// D:\tharun\New folder\mongapi\models\admins.js
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI || 'mongodb+srv://tmcyber:Tharun143%40@tm.bupjtnt.mongodb.net/tmcyber';
const client = new MongoClient(uri, {
  connectTimeoutMS: 5000, // Timeout after 5 seconds for connection
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
});
let db;

async function connect() {
  if (!db) {
    console.log('Establishing MongoDB connection...');
    await client.connect();
    db = client.db('tmcyber');
    console.log('MongoDB connection established');
  }
  return db;
}

const getAdminByEmail = async (email) => {
  const startTime = Date.now();
  const db = await connect();
  const admin = await db.collection('admins').findOne({ email });
  console.log(`getAdminByEmail took ${Date.now() - startTime}ms`);
  return admin;
};

const getAllAdmins = async () => {
  const startTime = Date.now();
  const db = await connect();
  const admins = await db.collection('admins')
    .find({}, { projection: { password_hash: 0 } })
    .sort({ created_at: -1 })
    .toArray();
  console.log(`getAllAdmins took ${Date.now() - startTime}ms`);
  return admins;
};

const getAdminById = async (id) => {
  const startTime = Date.now();
  const db = await connect();
  const admin = await db.collection('admins').findOne(
    { _id: new ObjectId(id) },
    { projection: { password_hash: 0 } }
  );
  console.log(`getAdminById took ${Date.now() - startTime}ms`);
  return admin;
};

const createAdmin = async (adminData) => {
  const startTime = Date.now();
  const db = await connect();
  const result = await db.collection('admins').insertOne(adminData);
  console.log(`createAdmin took ${Date.now() - startTime}ms`);
  return { ...adminData, _id: result.insertedId };
};

const updateAdmin = async (id, updateData) => {
  const startTime = Date.now();
  const db = await connect();
  const result = await db.collection('admins').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  console.log(`updateAdmin took ${Date.now() - startTime}ms`);
  return result.modifiedCount > 0;
};

const deleteAdmin = async (id) => {
  const startTime = Date.now();
  const db = await connect();
  const result = await db.collection('admins').deleteOne({ _id: new ObjectId(id) });
  console.log(`deleteAdmin took ${Date.now() - startTime}ms`);
  return result.deletedCount > 0;
};

// Export the client for reuse in other modules
module.exports = {
  getAdminByEmail,
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  mongoClient: client, // Export client for reuse
};