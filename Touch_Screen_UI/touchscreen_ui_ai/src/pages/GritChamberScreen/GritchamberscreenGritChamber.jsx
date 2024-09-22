import WaterIntakeSwitch from "../../components/WaterIntakeSwitch";
import React from "react";
import { Heading, Img } from "../../components";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function GritchamberscreenGritChamber() {
  const getWheelColor = (value) => {
    if (value < 50) return 'green';
    if (value < 70) return 'orange';
    return 'red';
  };
  let gritWaterLevel = 0;
  return (
    <div className="ml-4 mr-11 flex sm:mx-0">
      <WaterIntakeSwitch />
      <Img
        src="images/img_carret_right.svg"
        alt="Carretright"
        className="mb-[22px] mt-[34px] h-[100px] w-[14%] rounded-[40px] object-contain"
      />
      <div className="flex flex-col items-center w-[28%] gap-[30px] p-2 sm:gap-[30px] bg-white-a700 rounded-[18px]">
        <Heading as="p" className="text-[18px] font-medium text-blue_gray-800" style={{ marginTop: '10px' }}>
        Water Level (m):
        </Heading>
        <div className="flex items-center" style={{ width: '120px', height: '120px' }}>
                <CircularProgressbar value={gritWaterLevel} text={`${gritWaterLevel} m`} styles={buildStyles({
                    pathColor: getWheelColor(gritWaterLevel),
                    textColor: getWheelColor(gritWaterLevel),
                })}/>
        </div>
      </div>
      <Img
        src="images/img_carret_right.svg"
        alt="Carretright"
        className="relative z-[2] mb-[22px] mt-8 h-[100px] w-[14%] rounded-[40px] object-contain"
      />
      <WaterIntakeSwitch waterIntakeText="Water Outtake Pump:" className="relative z-[3]" />
    </div>
  );
}
