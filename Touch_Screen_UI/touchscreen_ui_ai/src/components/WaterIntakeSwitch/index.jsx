import { Heading } from "./..";
import React, { useState } from "react"; // Import useState
import Switch from '@mui/material/Switch';
import MqttComponent, { subscribeToTopic, publishToTopic } from "components/mqtt/mqttComponent";


export default function WaterIntakeSwitch({ 
  waterIntakeText = "Water Intake Pump:", 
  mqttTopic = "primary_intake/intake_pump", 
  ...props 
}) {
  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  // Create a state variable to manage the switch state
  const [isChecked, setIsChecked] = useState(false); 

  // Handler for switch change
  const handleChange = (event) => {
    setIsChecked(event.target.checked); // Update state based on switch position
    // You can also add any other logic needed when the switch is toggled here
    //document.getElementById('testSwitch').innerHTML = isChecked;
    //MqttComponent.
  };

  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[28%] h-[150px] gap-[30px] p-2 sm:gap-[30px] bg-white-a700 rounded-[18px]`}>
      <div className="flex justify-center items-center">
        <br />
        <br />
        <Heading as="p" className="text-[18px] font-medium text-blue_gray-800" id = "testSwitch">
          {waterIntakeText}
        </Heading>
      </div>
      <Switch
        {...label}
        checked={isChecked} // Set checked state based on the state variable
        onChange={handleChange} // Set the onChange handler
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#3df505', // Light green color when checked
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#3df505', // Light green color for the track when checked
          },
          transform: 'scale(2.0)', // Increase the size of the switch
        }}
      />
    </div>
  );
}
