import { Helmet } from "react-helmet";
import { Img, Heading } from "../../components";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import WaterIntakeSwitch from "../../components/WaterIntakeSwitch";
import React, { useEffect } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function PrimaryIntakeScreenPage() {
  const getWheelColor = (value) => {
    if (value < 50) return 'green';
    if (value < 70) return 'orange';
    return 'red';
  };
  useEffect(() => {
    document.getElementById('header-title').innerHTML = 'Primary Intake Controls';
    const menuItem = document.getElementById('primary-intake-nav');
    if (menuItem) {
      menuItem.style.color = '#2d60ff';
    }
  }, []);
  let primaryIntakeLevel = 66;

  return (
    <>
      <Helmet>
        <title>Primary intake screen</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="w-full bg-white-a700">
        <div className="mt-[26px] flex items-start gap-[22px]">
          <Sidebar1 />
          <div className="flex flex-1 flex-col gap-3.5 self-center sm:gap-3.5">
            <Header />
            <div className="flex flex-col gap-3 bg-gray-100 p-2.5 sm:gap-3">
              <div className="mr-7 flex sm:mr-0">
                <WaterIntakeSwitch waterIntakeText="Water Intake Pump:"/>
                <Img
                  src="images/img_carret_right.svg"
                  alt="Carretright"
                  className="mb-5 mt-9 h-[100px] w-[14%] rounded-[40px] object-contain"
                />
                <div className="flex flex-col items-center w-[28%] gap-[30px] p-2 sm:gap-[30px] bg-white-a700 rounded-[18px]">
                  <Heading as="p" className="text-[18px] font-medium text-blue_gray-800" style={{ marginTop: '10px' }}>
                  Water Level (m):
                  </Heading>
                  <div className="flex items-center" style={{ width: '120px', height: '120px' }}>
                          <CircularProgressbar value={primaryIntakeLevel} text={`${primaryIntakeLevel} m`} styles={buildStyles({
                              pathColor: getWheelColor(primaryIntakeLevel),
                              textColor: getWheelColor(primaryIntakeLevel),
                            })}/>
                  </div>
                </div>
                <Img
                  src="images/img_carret_right.svg"
                  alt="Carretright"
                  className="mb-5 mt-9 h-[100px] w-[14%] rounded-[40px] object-contain"
                />
                <WaterIntakeSwitch waterIntakeText="Water Outtake Pump:" />
              </div>
              <div className="mb-1.5 mr-1.5 flex flex-col items-start gap-3 sm:mr-0 sm:gap-3">
                <Heading
                  size="headingxs"
                  as="h1"
                  className="text-[22px] font-semibold text-blue_gray-800 sm:text-[18px]"
                >
                  Water Level History
                </Heading>
                <div className="ml-2 self-stretch rounded-[24px] bg-white-a700 p-[26px] sm:ml-0 sm:p-5">
                  <div className="relative h-[218px]">
                    {/*TODO: Add water level graph here*/}
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
