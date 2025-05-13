const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://tmcyber:Tharun143%40@tm.bupjtnt.mongodb.net/tmcyber';
const client = new MongoClient(uri);
let db;

// Initialize connection
async function connect() {
  if (!db) {
    await client.connect();
    db = client.db('tmcyber');
  }
  return db;
}

const getAdminByEmail = async (email) => {
  const db = await connect();
  return await db.collection('admins').findOne({ email });
};

const getAllAdmins = async () => {
  const db = await connect();
  return await db.collection('admins')
    .find({}, { projection: { password_hash: 0 } })
    .sort({ created_at: -1 })
    .toArray();
};

const getAdminById = async (id) => {
  const db = await connect();
  return await db.collection('admins').findOne(
    { _id: new ObjectId(id) },
    { projection: { password_hash: 0 } }
  );
};

const createAdmin = async (adminData) => {
  const db = await connect();
  const result = await db.collection('admins').insertOne(adminData);
  return { ...adminData, _id: result.insertedId };
};

const updateAdmin = async (id, updateData) => {
  const db = await connect();
  const result = await db.collection('admins').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  return result.modifiedCount > 0;
};

const deleteAdmin = async (id) => {
  const db = await connect();
  const result = await db.collection('admins').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};

// Close connection on process exit
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});

module.exports = {
  getAdminByEmail,
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};