const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://tmcyber:Tharun143%40@tm.bupjtnt.mongodb.net/tmcyber';
const client = new MongoClient(uri);
let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db('tmcyber');
  }
  return db;
}

const getAllCertificates = async () => {
  const db = await connect();
  return await db.collection('certificates')
    .find({})
    .sort({ created_at: -1 })
    .toArray();
};

const getCertificateById = async (id) => {
  const db = await connect();
  return await db.collection('certificates').findOne({ _id: new ObjectId(id) });
};

const createCertificate = async (certificateData) => {
  const db = await connect();
  const result = await db.collection('certificates').insertOne(certificateData);
  return { ...certificateData, _id: result.insertedId };
};

const updateCertificate = async (id, updateData) => {
  const db = await connect();
  const result = await db.collection('certificates')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
  return result.value;
};

const deleteCertificate = async (id) => {
  const db = await connect();
  const result = await db.collection('certificates').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};

// Close connection on process exit
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});

module.exports = {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};