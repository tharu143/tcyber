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

const getAllEmployees = async () => {
  const db = await connect();
  return await db.collection('employees')
    .find({})
    .sort({ created_at: -1 })
    .toArray();
};

const getEmployeeById = async (id) => {
  const db = await connect();
  return await db.collection('employees').findOne({ _id: new ObjectId(id) });
};

const createEmployee = async (employeeData) => {
  const db = await connect();
  const result = await db.collection('employees').insertOne(employeeData);
  return { ...employeeData, _id: result.insertedId };
};

const updateEmployee = async (id, updateData) => {
  const db = await connect();
  const result = await db.collection('employees')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
  return result.value;
};

const deleteEmployee = async (id) => {
  const db = await connect();
  const result = await db.collection('employees').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};

// Close connection on process exit
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};