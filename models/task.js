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

const getAllTasks = async () => {
  const db = await connect();
  return await db.collection('tasks')
    .aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employee_id',
          foreignField: '_id',
          as: 'employee',
        },
      },
      { $unwind: '$employee' },
      {
        $project: {
          id: '$_id',
          employee_id: '$employee_id',
          employee_name: '$employee.name',
          title: '$title',
          description: '$description',
          status: '$status',
          due_date: '$due_date',
          created_at: '$created_at',
        },
      },
      { $sort: { created_at: -1 } },
    ])
    .toArray();
};

const getTaskById = async (id) => {
  const db = await connect();
  const task = await db.collection('tasks')
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'employees',
          localField: 'employee_id',
          foreignField: '_id',
          as: 'employee',
        },
      },
      { $unwind: '$employee' },
      {
        $project: {
          id: '$_id',
          employee_id: '$employee_id',
          employee_name: '$employee.name',
          title: '$title',
          description: '$description',
          status: '$status',
          due_date: '$due_date',
          created_at: '$created_at',
        },
      },
    ])
    .toArray();
  return task[0];
};

const createTask = async (taskData) => {
  const db = await connect();
  const result = await db.collection('tasks').insertOne(taskData);
  return { ...taskData, _id: result.insertedId };
};

const updateTask = async (id, updateData) => {
  const db = await connect();
  const result = await db.collection('tasks')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
  return result.value;
};

const deleteTask = async (id) => {
  const db = await connect();
  const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};

const getEmployeeById = async (id) => {
  const db = await connect();
  return await db.collection('employees').findOne({ _id: new ObjectId(id) });
};

// Close connection on process exit
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getEmployeeById,
};