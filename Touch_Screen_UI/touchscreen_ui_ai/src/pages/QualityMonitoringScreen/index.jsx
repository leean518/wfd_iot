import { Helmet } from "react-helmet";
import { Img, Heading } from "../../components";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import WaterIntakeSwitch from "../../components/WaterIntakeSwitch";
import React, { useEffect, useContext, useState } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import MqttContext from './../../components/mqtt/MqttContext';
import MqttComponent from 'components/mqtt/mqttComponent';
import handleStats from 'components/stats/handleStats';

export default function QualityMonitoringScreenPage() {
  const { mqttClient } = useContext(MqttContext);
  const [qualityPHLevel, setQualityPHLevel] = useState(0);
  const [qualityWaterLevel, setQualityWaterLevel] = useState(0);
  const [qualityTemp, setQualityTemp] = useState(0);
  const getWheelColor = (value) => {
    if (value < 50) return 'green';
    if (value < 70) return 'orange';
    return 'red';
  };
  
  MqttComponent.subscribeToTopic(mqttClient, 'quality_monitoring/water_level', (message) => handleStats.handleWaterLevel(message, setQualityWaterLevel));
  MqttComponent.subscribeToTopic(mqttClient, 'quality_monitoring/ph_sensor', (message) => handleStats.handlePHLevel(message, setQualityPHLevel));
  MqttComponent.subscribeToTopic(mqttClient, 'quality_monitoring/water_temp', (message) => handleStats.handleWaterTemp(message, setQualityTemp));
  useEffect(() => {
    document.getElementById('header-title').innerHTML = 'Quality Monitoring Controls';
    const menuItem = document.getElementById('quality-monitoring-nav');
    if (menuItem) {
      menuItem.style.color = '#2d60ff';
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Quality Monitoring Screen</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="w-full bg-white-a700">
        <div className="mt-[26px] flex items-start gap-[22px]">
          <Sidebar1 />
          <div className="flex flex-1 flex-col gap-3.5 self-center sm:gap-3.5">
            <Header />
           <div className="flex flex-col items-center justify-center gap-1 bg-gray-100 p-2.5 sm:gap-1">
              {/* First Row */}
              <div className="flex w-3/4 items-center sm:mr-0 gap-[10px] mb-4"> {/* Added mb-4 */}
                <WaterIntakeSwitch waterIntakeText="Dechlorination to Quality Monitoring Pump:" className="w-[310px] h-[170px]" />
                <Img
                  src="images/img_carret_right.svg"
                  alt="Carretright"
                  className="w-[300px] h-[150px] rounded-[40px] object-contain"
                />
                <div className="flex flex-col items-center w-[300px] gap-[10px] p-2 sm:gap-[10px] bg-white-a700 rounded-[18px]">
                  <Heading as="p" className="text-[18px] font-medium text-blue_gray-800" style={{ marginTop: '10px' }}>
                    Water Level:
                  </Heading>
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="w-[120px] h-[120px]">
                      <CircularProgressbar
                        value={qualityWaterLevel}
                        text={`${qualityWaterLevel} m`}
                        styles={buildStyles({
                          pathColor: getWheelColor(qualityWaterLevel),
                          textColor: getWheelColor(qualityWaterLevel),
                        })}
                      />
                    </div>
                  </div>
                  <br></br>
                  {/* Water Temperature Block */}
                  <Heading as="p" className="text-[18px] font-medium text-blue_gray-800" style={{ marginTop: '10px' }}>
                    Water Temperature:
                  </Heading>
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="w-[120px] h-[120px]">
                      <CircularProgressbar
                        value={qualityTemp}
                        text={`${qualityTemp} °F`}
                        styles={buildStyles({
                          pathColor: getWheelColor(qualityTemp),
                          textColor: getWheelColor(qualityTemp),
                        })}
                      />
                    </div>
                  </div>
                  <br></br>
                  {/* pH Level Block */}
                  <Heading as="p" className="text-[18px] font-medium text-blue_gray-800" style={{ marginTop: '10px' }}>
                    Water pH Level:
                  </Heading>
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="w-[120px] h-[120px]">
                      <CircularProgressbar
                        value={qualityPHLevel}
                        text={`${qualityPHLevel}`}
                        styles={buildStyles({
                          pathColor: getWheelColor(qualityPHLevel),
                          textColor: getWheelColor(qualityPHLevel),
                        })}
                      />
                    </div>
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
