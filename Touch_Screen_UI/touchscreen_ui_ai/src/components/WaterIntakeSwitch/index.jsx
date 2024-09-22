import { Heading } from "./..";
import React from "react";
import Switch from '@mui/material/Switch';

export default function WaterIntakeSwitch({ waterIntakeText = "Water Intake Pump:", ...props }) {
  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[28%] gap-[30px] p-2 sm:gap-[30px] bg-white-a700 rounded-[18px]`}>
      <div className="flex justify-center items-center">
        <br></br>
        <br></br>
        <Heading as="p" className="text-[18px] font-medium text-blue_gray-800">
          {waterIntakeText}
        </Heading>
      </div>
      <Switch
        {...label}
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
