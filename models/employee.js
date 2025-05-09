const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://tmcyber:Tharun143%40@tm.bupjtnt.mongodb.net/tmcyber';
const client = new MongoClient(uri);

const getAllEmployees = async () => {
  try {
    await client.connect();
    const db = client.db();
    return await db.collection('employees')
      .find({})
      .sort({ created_at: -1 })
      .toArray();
  } finally {
    await client.close();
  }
};

const getEmployeeById = async (id) => {
  try {
    await client.connect();
    const db = client.db();
    return await db.collection('employees').findOne({ _id: new ObjectId(id) });
  } finally {
    await client.close();
  }
};

const createEmployee = async (employeeData) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('employees').insertOne(employeeData);
    return { ...employeeData, _id: result.insertedId };
  } finally {
    await client.close();
  }
};

const updateEmployee = async (id, updateData) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('employees')
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

const deleteEmployee = async (id) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('employees').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } finally {
    await client.close();
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};