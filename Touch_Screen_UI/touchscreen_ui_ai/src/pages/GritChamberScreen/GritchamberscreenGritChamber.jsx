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
  let gritTDSLevel = 0;
  return (
    <div className="ml-4 mr-11 flex sm:mx-0">
      <WaterIntakeSwitch waterIntakeText="Primary Intake to Grit Pump:"/>
      <Img
        src="images/img_carret_right.svg"
        alt="Carretright"
        className="mb-[22px] mt-[34px] h-[100px] w-[14%] rounded-[40px] object-contain"
      />
      <div className="flex w-[40%] rounded-[20px] bg-white-a700 p-1.5 overflow-hidden max-w-full justify-center items-center">
        <div className="mb-7 flex w-full flex-col items-center gap-2 sm:w-full sm:gap-2 justify-center">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            <Heading
              size="texts"
              as="h3"
              className="text-[24px] font-medium text-blue_gray-800 sm:text-[13px]"
            >
              Grit Chamber:
            </Heading>
            <div className="flex justify-center items-center gap-14 flex-wrap">
              <div className="flex flex-col items-center">
                <Heading
                  as="h4"
                  className="text-[18px] font-medium text-blue_gray-800">
                  Water Level:{" "}
                </Heading>
                <div className="flex items-center mt-2" style={{ width: '130px', height: '130px' }}>
                  <CircularProgressbar value={gritWaterLevel} text={`${gritWaterLevel} m`} styles={buildStyles({
                    pathColor: getWheelColor(gritWaterLevel),
                    textColor: getWheelColor(gritWaterLevel),
                  })}/>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Heading
                  as="h4"
                  className="text-[18px] font-medium text-blue_gray-800">
                  Grit Level:{" "}
                </Heading>
                <div className="flex items-center mt-2" style={{ width: '130px', height: '130px' }}>
                  <CircularProgressbar value={gritTDSLevel} text={`${gritTDSLevel} ppm`} styles={buildStyles({
                    pathColor: getWheelColor(gritTDSLevel),
                    textColor: getWheelColor(gritTDSLevel),
                  })}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Img
        src="images/img_carret_right.svg"
        alt="Carretright"
        className="relative z-[2] mb-[22px] mt-8 h-[100px] w-[14%] rounded-[40px] object-contain"
      />
      <WaterIntakeSwitch waterIntakeText="Grit to Chlorination Pump:" className="relative z-[3]" />
    </div>
  );
}
