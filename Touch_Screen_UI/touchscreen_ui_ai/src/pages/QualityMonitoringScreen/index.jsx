import { Helmet } from "react-helmet";
import { Img } from "../../components";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import WaterIntakeSwitch from "../../components/WaterIntakeSwitch";
import React, { useEffect } from "react";

export default function QualityMonitoringScreenPage() {
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
            <div>
              <div className="md:px-5 bg-gray-100 py-[30px] pl-[76px] pr-14 sm:p-5">
                <div className="mb-[42px] mr-[70px] grid grid-cols-3 gap-1 sm:mr-0 sm:grid-cols-1">
                  <WaterIntakeSwitch />
                  <Img
                    src="images/img_carret_right.svg"
                    alt="Carretright"
                    className="h-[100px] w-full rounded-[40px] sm:h-auto"
                  />
                  <WaterIntakeSwitch />
                  <WaterIntakeSwitch />
                  <WaterIntakeSwitch />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
