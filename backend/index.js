const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let uri = `mongodb+srv://UserGuy:${process.env.DB_PASSWORD}@cluster0.5mbj5pg.mongodb.net`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Sample Route
// app.get('/api', (req, res) => {
//   res.json({ message: 'Hello from Express!' });
// });

const checkinRouter = require('./routes/checkin');
app.use('/api/checkin', checkinRouter);

// Serve React build files in production
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));