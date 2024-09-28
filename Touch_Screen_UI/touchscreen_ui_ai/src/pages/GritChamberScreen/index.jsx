import { Helmet } from "react-helmet";
import { Heading } from "../../components";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import GritchamberscreenGritChamber from "./GritchamberscreenGritChamber";
import React, { useEffect } from "react";
import WaterLevelGraph from '../../components/GritLevelGraph/waterLevelGraph';

export default function GritChamberScreenPage() {
  useEffect(() => {
    document.getElementById('header-title').innerHTML = 'Grit Chamber Controls';
    const menuItem = document.getElementById('grit-chamber-nav');
    if (menuItem) {
      menuItem.style.color = '#2d60ff';
    }
  }, []);
  return (
    <>
      <Helmet>
        <title>Grit chamber screen</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="w-full bg-white-a700">
        <div className="mt-[26px] flex items-start gap-[22px]">
          <Sidebar1 />
          <div className="flex flex-1 flex-col gap-3.5 self-center sm:gap-3.5">
            <Header />
            <div className="flex flex-col gap-3 bg-gray-100 py-2.5 sm:gap-3">
              <GritchamberscreenGritChamber />
              <div className="mb-1.5 mr-1.5 flex flex-col items-start gap-3 sm:mr-0 sm:gap-3">
                <Heading
                  size="headingxs"
                  as="h1"
                  className="text-[22px] font-semibold text-blue_gray-800 sm:text-[18px]"
                  style={{ marginLeft: '10px' }}
                >
                  Water Level History
                </Heading>

                <div className="ml-2 self-stretch rounded-[24px] bg-white-a700 p-[26px] sm:ml-0 sm:p-5">
                  <WaterLevelGraph className="relative h-[218px]" />  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
