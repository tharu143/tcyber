const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://tmcyber:Tharun143%40@tm.bupjtnt.mongodb.net/tmcyber';
const client = new MongoClient(uri);

const getAdminByEmail = async (email) => {
  try {
    await client.connect();
    const db = client.db();
    return await db.collection('admins').findOne({ email });
  } finally {
    await client.close();
  }
};

const getAllAdmins = async () => {
  try {
    await client.connect();
    const db = client.db();
    return await db.collection('admins')
      .find({}, { projection: { password_hash: 0 } })
      .sort({ created_at: -1 })
      .toArray();
  } finally {
    await client.close();
  }
};

const getAdminById = async (id) => {
  try {
    await client.connect();
    const db = client.db();
    return await db.collection('admins').findOne(
      { _id: new ObjectId(id) },
      { projection: { password_hash: 0 } }
    );
  } finally {
    await client.close();
  }
};

const createAdmin = async (adminData) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('admins').insertOne(adminData);
    return { ...adminData, _id: result.insertedId };
  } finally {
    await client.close();
  }
};

const updateAdmin = async (id, updateData) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('admins').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
  } finally {
    await client.close();
  }
};

const deleteAdmin = async (id) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('admins').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } finally {
    await client.close();
  }
};

module.exports = {
  getAdminByEmail,
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};