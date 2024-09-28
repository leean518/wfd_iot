const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const WaterLevel = require('./waterLevel.jsx');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/primary_water_level', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API route to get water level data
app.get('/api/water-levels', async (req, res) => {
  try {
    const data = await WaterLevel.find().sort({ timestamp: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
