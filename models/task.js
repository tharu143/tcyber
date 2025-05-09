const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://tmcyber:Tharun143%40@tm.bupjtnt.mongodb.net/tmcyber';
const client = new MongoClient(uri);

const getAllTasks = async () => {
  try {
    await client.connect();
    const db = client.db();
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
  } finally {
    await client.close();
  }
};

const getTaskById = async (id) => {
  try {
    await client.connect();
    const db = client.db();
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
  } finally {
    await client.close();
  }
};

const createTask = async (taskData) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('tasks').insertOne(taskData);
    return { ...taskData, _id: result.insertedId };
  } finally {
    await client.close();
  }
};

const updateTask = async (id, updateData) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('tasks')
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

const deleteTask = async (id) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
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

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getEmployeeById,
};