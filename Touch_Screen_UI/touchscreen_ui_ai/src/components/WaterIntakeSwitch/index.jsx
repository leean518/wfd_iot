import { Heading } from "./..";
import React, { useContext, useState } from "react"; // Import useState
import Switch from '@mui/material/Switch';
import MqttContext from './../mqtt/MqttContext';
import MqttComponent from 'components/mqtt/mqttComponent';


export default function WaterIntakeSwitch({ 
  waterIntakeText = "Water Intake Pump:", 
  mqttTopic = "primary_intake/intake_pump", 
  ...props 
}) {
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const mqttClient = useContext(MqttContext);
  // Create a state variable to manage the switch state
  const [isChecked, setIsChecked] = useState(false); 

  // Handler for switch change
  const handleChange = (event) => {
    setIsChecked(event.target.checked); // Update state based on switch position
    // You can also add any other logic needed when the switch is toggled here
    //document.getElementById('testSwitch').innerHTML = isChecked;
    MqttComponent.publishMessage( mqttClient, 'test/topic', 'ON OFF')
  };

  return (
    <div
  {...props}
  className={`${props.className} flex flex-col items-center w-[28%] h-[150px] gap-[30px] p-2 sm:gap-[30px] bg-white-a700 rounded-[18px]`}>
  <div className="flex flex-col justify-center items-center w-full h-full p-4">
    <Heading as="p" className="text-[18px] font-medium text-blue_gray-800 text-center p-2" id="testSwitch">
      {waterIntakeText}
    </Heading>
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
      className="p-4"
    />
  </div>
</div>

  );
}
