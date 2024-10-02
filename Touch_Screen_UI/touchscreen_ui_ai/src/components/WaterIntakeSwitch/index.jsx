import { Heading } from "./..";
import React, { useContext, useState, useEffect, useRef } from "react"; // Import useState, useEffect, and useRef
import Switch from '@mui/material/Switch';
import MqttContext from './../mqtt/MqttContext';
import MqttComponent from 'components/mqtt/mqttComponent';

export default function WaterIntakeSwitch({ 
  waterIntakeText = "Water Intake Pump:", 
  mqttTopic = "prim_chamber/intake_pump", 
  ...props 
}) {
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const { mqttClient, getState, updateState } = useContext(MqttContext);
  const [isChecked, setIsChecked] = useState(false); 
  const divRef = useRef(null); // Create a ref for the div element

  // Function to switch state
  function switchState(state) {

    setIsChecked(state); // Update the state based on the external call

  }

  // Attach the switchState function to the element
  useEffect(() => {
    if (divRef.current) {
      divRef.current.switchState = switchState;
    }
    const currState = getState(mqttTopic); 
    console.log(mqttTopic + ":" + currState);
    setIsChecked(currState);
  }, []);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
    console.log(event.target.checked);
    if (event.target.checked) {
      MqttComponent.publishMessage(mqttClient, mqttTopic, 'Turn on');
      updateState(mqttTopic, true);
    } else {
      MqttComponent.publishMessage(mqttClient, mqttTopic, 'Turn off');
      updateState(mqttTopic, false);
    }
  };

  return (
    <div
      {...props}
      ref={divRef} // Attach the ref to the div element
      className={`${props.className} flex flex-col items-center w-[28%] h-[150px] gap-[30px] p-2 sm:gap-[30px] bg-white-a700 rounded-[18px]`}>
      <div className="flex flex-col justify-center items-center w-full h-full p-4">
        <Heading as="p" className="text-[18px] font-medium text-blue_gray-800 text-center p-2" id="testSwitch">
          {waterIntakeText}
        </Heading>
        <Switch
          {...label}
          checked={isChecked}
          onChange={handleChange}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#3df505',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#3df505',
            },
            transform: 'scale(2.0)',
          }}
          className="p-4"
        />
      </div>
    </div>
  );
}
