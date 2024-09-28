import React from 'react';
import axios from 'axios';

const insertWaterLevel = async (level, timestamp) => {
  try {
    const response = await axios.post('http://localhost:5000/api/water-levels', {
      level,            // e.g., water level in meters
      timestamp,        // optional, if not provided current time will be used
    });
    console.log('Water level inserted:', response.data);
  } catch (error) {
    console.error('Error inserting water level:', error);
  }
};

const insertGritWaterLevel = async (level, timestamp) => {
  try {
    const response = await axios.post('http://localhost:5001/api/water-levels', {
      level,            // e.g., water level in meters
      timestamp,        // optional, if not provided current time will be used
    });
    console.log('Water level inserted:', response.data);
  } catch (error) {
    console.error('Error inserting water level:', error);
  }
};

export function handlePrimaryWaterLevel(message, setVal) {
  const newLevelVal = parseFloat(((parseFloat(message) / 1024) * 100).toFixed(2));

  setVal(newLevelVal);
  insertGritWaterLevel(newLevelVal, new Date()); // Insert record into database
}

export function handleGritWaterLevel(message, setVal) {
  const newLevelVal = parseFloat(((parseFloat(message) / 1024) * 100).toFixed(2));

  setVal(newLevelVal);
  insertWaterLevel(newLevelVal, new Date()); // Insert record into database
}

export function handleWaterLevel(message, setVal) {
  const newLevelVal = parseFloat(((parseFloat(message) / 1024) * 100).toFixed(2));

  setVal(newLevelVal);

}

export function handlePHLevel(message, setVal) {
  const newLevelVal = parseFloat(message);

  setVal(newLevelVal);

}

export function handleWaterTemp(message, setVal) {
  const newLevelVal = parseFloat(message);

  setVal(newLevelVal);

}



// Default export
export default {
    handlePrimaryWaterLevel,
    handleGritWaterLevel,
    handleWaterLevel,
    handlePHLevel,
    handleWaterTemp
};