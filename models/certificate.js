const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://tmcyber:Tharun143%40@tm.bupjtnt.mongodb.net/tmcyber';
const client = new MongoClient(uri);

const getAllCertificates = async () => {
  try {
    await client.connect();
    const db = client.db();
    return await db.collection('certificates')
      .find({})
      .sort({ created_at: -1 })
      .toArray();
  } finally {
    await client.close();
  }
};

const getCertificateById = async (id) => {
  try {
    await client.connect();
    const db = client.db();
    return await db.collection('certificates').findOne({ _id: new ObjectId(id) });
  } finally {
    await client.close();
  }
};

const createCertificate = async (certificateData) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('certificates').insertOne(certificateData);
    return { ...certificateData, _id: result.insertedId };
  } finally {
    await client.close();
  }
};

const updateCertificate = async (id, updateData) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('certificates')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    return result.value;
  } finally {
    await client.close();
  }
};

const deleteCertificate = async (id) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('certificates').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } finally {
    await client.close();
  }
};

module.exports = {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};