// backend/waterLevel.js
const mongoose = require('mongoose');

// Water Level Schema
const WaterLevelSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Export the model
const WaterLevel = mongoose.model('WaterLevel', WaterLevelSchema);
module.exports = WaterLevel;

