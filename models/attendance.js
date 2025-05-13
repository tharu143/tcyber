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

const getAllAttendance = async () => {
  const db = await connect();
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
};

const getAttendanceById = async (id) => {
  const db = await connect();
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
};

const createAttendance = async (attendanceData) => {
  const db = await connect();
  const result = await db.collection('attendance').insertOne(attendanceData);
  return { ...attendanceData, _id: result.insertedId };
};

const updateAttendance = async (id, updateData) => {
  const db = await connect();
  const result = await db.collection('attendance')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
  return result.value;
};

const deleteAttendance = async (id) => {
  const db = await connect();
  const result = await db.collection('attendance').deleteOne({ _id: new ObjectId(id) });
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
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getEmployeeById,
};