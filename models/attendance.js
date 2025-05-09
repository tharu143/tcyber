const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://tmcyber:Tharun143%40@tm.bupjtnt.mongodb.net/tmcyber';
const client = new MongoClient(uri);

const getAllAttendance = async () => {
  try {
    await client.connect();
    const db = client.db();
    return await db.collection('attendance')
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
            date: '$date',
            status: '$status',
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

const getAttendanceById = async (id) => {
  try {
    await client.connect();
    const db = client.db();
    const attendanceRecord = await db.collection('attendance')
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
            date: '$date',
            status: '$status',
            created_at: '$created_at',
          },
        },
      ])
      .toArray();
    return attendanceRecord[0];
  } finally {
    await client.close();
  }
};

const createAttendance = async (attendanceData) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('attendance').insertOne(attendanceData);
    return { ...attendanceData, _id: result.insertedId };
  } finally {
    await client.close();
  }
};

const updateAttendance = async (id, updateData) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('attendance')
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

const deleteAttendance = async (id) => {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('attendance').deleteOne({ _id: new ObjectId(id) });
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
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getEmployeeById,
};