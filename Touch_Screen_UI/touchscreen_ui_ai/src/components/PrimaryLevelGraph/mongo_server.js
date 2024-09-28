// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const WaterLevel = require('./waterLevel'); // Mongoose model

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/primary_water_level', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API route to get water level data (Read)
app.get('/api/water-levels', async (req, res) => {
  try {
    const data = await WaterLevel.find().sort({ timestamp: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API route to insert water level data (Create)
app.post('/api/water-levels', async (req, res) => {
  const { level, timestamp } = req.body; // Expecting level and timestamp in request body
  const waterLevelData = new WaterLevel({
    level,
    timestamp: timestamp || Date.now(), // Use current date if no timestamp provided
  });

  try {
    const savedData = await waterLevelData.save();
    res.status(201).json(savedData); // Return the saved document
  } catch (err) {
    res.status(400).json({ message: 'Error inserting water level data', err });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
