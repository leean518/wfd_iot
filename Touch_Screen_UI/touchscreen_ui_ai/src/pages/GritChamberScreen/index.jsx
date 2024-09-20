import { Helmet } from "react-helmet";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import GritchamberscreenGritChamber from "./GritchamberscreenGritChamber";
import React, { useEffect } from "react";

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
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
