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

const getAllInternshipCertificates = async () => {
  const db = await connect();
  return await db.collection('internship_certificates')
    .find({})
    .sort({ created_at: -1 })
    .toArray();
};

const getInternshipCertificateById = async (id) => {
  const db = await connect();
  return await db.collection('internship_certificates').findOne({ _id: new ObjectId(id) });
};

const createInternshipCertificate = async (certificateData) => {
  const db = await connect();
  const result = await db.collection('internship_certificates').insertOne(certificateData);
  return { ...certificateData, _id: result.insertedId };
};

const updateInternshipCertificate = async (id, updateData) => {
  const db = await connect();
  const result = await db.collection('internship_certificates')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
  return result.value;
};

const deleteInternshipCertificate = async (id) => {
  const db = await connect();
  const result = await db.collection('internship_certificates').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};

// Close connection on process exit
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});

module.exports = {
  getAllInternshipCertificates,
  getInternshipCertificateById,
  createInternshipCertificate,
  updateInternshipCertificate,
  deleteInternshipCertificate,
};
