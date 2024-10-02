import { Helmet } from "react-helmet";
import { Heading, Img } from "../../components";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import React, { useEffect, useContext, useState } from "react";
import WaterIntakeSwitch from "../../components/WaterIntakeSwitch";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import MqttContext from './../../components/mqtt/MqttContext';
import MqttComponent from 'components/mqtt/mqttComponent';
import handleStats from 'components/stats/handleStats';

export default function ChlorinationChamberScreenPage() {
  const { mqttClient } = useContext(MqttContext);
  const [chlorinationPHLevel, setChlorinationPHLevel] = useState(0);
  const [chlorinationWaterLevel, setChlorinationWaterLevel] = useState(0);

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
  MqttComponent.subscribeToTopic(mqttClient, 'chlo_chamber/ph_sensor', (message) => handleStats.handlePHLevel(message, setChlorinationPHLevel));
  MqttComponent.subscribeToTopic(mqttClient, 'chlo_chamber/water_level', (message) => handleStats.handleWaterLevel(message, setChlorinationWaterLevel));
  return (
    <>
      <Helmet>
        <title>Chlorination Chamber</title>
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
                    <WaterIntakeSwitch waterIntakeText="Grit to Chlorination Pump:" mqttTopic="grit_chamber/outtake_pump"/>
                    <div className="flex flex-col">
                      <Img
                        src="images/img_carret_right.svg"
                        alt="Carretright"
                        className="relative mr-[24px] h-[150px] w-[150px] rounded-[40px]"
                      />
                    </div>

                    <div className="flex flex-1 items-center justify-center bg-white-a700 rounded-[18px] p-6">
                      <div className="flex flex-col items-center p-6">
                        <Heading
                          as="h4"
                          className="text-[18px] font-medium text-blue_gray-800"
                        >
                          Water pH Level:
                        </Heading>
                        <br />
                        <div className="flex items-center" style={{ width: '150px', height: '150px' }}>
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
                          Water Level:
                        </Heading>
                        <br />
                        <div className="flex items-center" style={{ width: '150px', height: '150px' }}>
                          <CircularProgressbar value={chlorinationWaterLevel} text={`${chlorinationWaterLevel} m`} styles={buildStyles({
                            pathColor: getWheelColor(chlorinationWaterLevel),
                            textColor: getWheelColor(chlorinationWaterLevel),
                          })} />
                        </div>
                      </div>
                    </div>
                   <div className="flex flex-col">
                      <Img
                        src="images/img_carret_right.svg"
                        alt="Carretright"
                        className="relative mr-[24px] h-[150px] w-[150px] rounded-[40px]"
                      />
                    </div>

                    <WaterIntakeSwitch waterIntakeText="Chlorination to Dechlorination Pump:" mqttTopic="chlo_chamber/outtake_pump" />
                  </div>
                  <div className="w-[26%] sm:w-full">
                    <Img
                      src="images/img_carret_right_blue_a700.svg"
                      alt="Carretright"
                      className="relative z-[3] ml-[90px] mr-[60px] h-[125px] w-[125px] rounded-[40px] sm:mx-0"
                    />
                  </div>

                  <WaterIntakeSwitch waterIntakeText="Acidic Solution Pump:" mqttTopic="acid_chamber/outtake_pump" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
