
const mongoose = require('mongoose');

const WaterLevelSchema = new mongoose.Schema({
  level: { type: Number, required: true }, // water level
  timestamp: { type: Date, default: Date.now } // time of reading
});

module.exports = mongoose.model('WaterLevel', WaterLevelSchema);
