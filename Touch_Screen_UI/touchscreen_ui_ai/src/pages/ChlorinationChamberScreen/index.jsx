import { Helmet } from "react-helmet";
import { Heading, Img } from "../../components";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import React, { useEffect } from "react";
import WaterIntakeSwitch from "../../components/WaterIntakeSwitch";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ChlorinationChamberScreenPage() {
  const getWheelColor = (value) => {
    if (value < 50) return 'green';
    if (value < 70) return 'orange';
    return 'red';
  };
  useEffect(() => {
    document.getElementById('header-title').innerHTML = 'Chlorination Chamber Controls';
    const menuItem = document.getElementById('chlorination-chamber-nav');
    if (menuItem) {
      menuItem.style.color = '#2d60ff';
    }
  }, []);
  let chlorinationPHLevel = 20;
  let chlorinationWaterLevel = 51;
  return (
    <>
      <Helmet>
        <title>Chlorination chamber screen</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="w-full bg-white-a700">
        <div className="mt-[26px] flex items-start gap-[22px]">
          <Sidebar1 />
          <div className="flex flex-1 flex-col gap-3.5 self-center sm:gap-3.5">
            <Header />
            <div>
              <div className="bg-gray-100 px-[18px] py-9 sm:py-5">
                <div className="mb-[52px] flex flex-col items-center gap-1 sm:gap-1">
                  <div className="mr-2 flex  sm:mr-0">
                    <WaterIntakeSwitch waterIntakeText="Water Intake Pump:" />
                    <div className="flex flex-col items-center justify-center">
                      <Img
                        src="images/img_carret_right.svg"
                        alt="Carretright"
                        className="relative ml-[-26px] h-[150px] w-[150px] rounded-[40px]"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-center bg-white-a700 rounded-[18px] p-6">
                      <div className="flex flex-col items-center p-6">
                        <Heading
                          as="h4"
                          className="text-[18px] font-medium text-blue_gray-800"
                        >
                          pH Level:
                        </Heading>
                        <br />
                        <div className="flex items-center" style={{ width: '100px', height: '100px' }}>
                          <CircularProgressbar value={chlorinationPHLevel} text={`${chlorinationPHLevel}`} styles={buildStyles({
                            pathColor: getWheelColor(chlorinationPHLevel),
                            textColor: getWheelColor(chlorinationPHLevel),
                          })} />
                        </div>
                      </div>
                      <div className="flex flex-col items-center p-6">
                        <Heading
                          as="h4"
                          className="text-[18px] font-medium text-blue_gray-800"
                        >
                          TDS Level:
                        </Heading>
                        <br />
                        <div className="flex items-center" style={{ width: '100px', height: '100px' }}>
                          <CircularProgressbar value={chlorinationWaterLevel} text={`${chlorinationWaterLevel} m`} styles={buildStyles({
                            pathColor: getWheelColor(chlorinationWaterLevel),
                            textColor: getWheelColor(chlorinationWaterLevel),
                          })} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <Img
                        src="images/img_carret_right.svg"
                        alt="Carretright"
                        className="relative ml-[-26px] h-[150px] w-[150px] rounded-[40px]"
                      />
                    </div>

                    <WaterIntakeSwitch waterIntakeText="Water Outtake Pump:" />
                  </div>
                  <div className="w-[26%] sm:w-full">
                    <Img
                      src="images/img_carret_right_blue_a700.svg"
                      alt="Carretright"
                      className="relative z-[3] ml-[105px] mr-[30px] h-[100px] w-[100px] rounded-[40px] sm:mx-0"
                    />
                  </div>
                  <WaterIntakeSwitch waterIntakeText="Acidic Solution Pump:" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
