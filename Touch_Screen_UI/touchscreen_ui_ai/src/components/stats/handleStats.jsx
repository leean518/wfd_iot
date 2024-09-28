import React from 'react';

export function handleWaterLevel(message, setVal) {
  const newLevelVal = parseFloat(((parseFloat(message) / 1024) * 100).toFixed(2));

  setVal(newLevelVal);

  console.log(newLevelVal);
}

export function handlePHLevel(message, setVal) {
  const newLevelVal = parseFloat(message);

  setVal(newLevelVal);

  console.log(newLevelVal);
}

export function handleWaterTemp(message, setVal) {
  const newLevelVal = parseFloat(message);

  setVal(newLevelVal);

  console.log(newLevelVal);
}



// Default export
export default {
    handleWaterLevel,
    handlePHLevel,
    handleWaterTemp
};