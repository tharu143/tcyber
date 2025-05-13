require('dotenv').config();
const express = require('express');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Allowed frontend URLs for both development and production
const allowedOrigins = [
  'http://localhost:5173',
  'https://tmcybertech.netlify.app',
];

// CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// Routes
app.use('/api', adminRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', certificateRoutes);
app.use('/api', employeeRoutes);
app.use('/api', taskRoutes);

// Start Server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});