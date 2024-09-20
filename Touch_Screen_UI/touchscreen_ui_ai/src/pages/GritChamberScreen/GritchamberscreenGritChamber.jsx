import { Img } from "../../components";
import WaterIntakeSwitch from "../../components/WaterIntakeSwitch";
import React from "react";

export default function GritchamberscreenGritChamber() {
  return (
    <div className="ml-4 mr-11 flex sm:mx-0">
      <WaterIntakeSwitch />
      <Img
        src="images/img_carret_right.svg"
        alt="Carretright"
        className="mb-[22px] mt-[34px] h-[100px] w-[14%] rounded-[40px] object-contain"
      />
      <WaterIntakeSwitch />
      <Img
        src="images/img_carret_right.svg"
        alt="Carretright"
        className="relative z-[2] mb-[22px] mt-8 h-[100px] w-[14%] rounded-[40px] object-contain"
      />
      <WaterIntakeSwitch waterIntakeText="Water Outtake Pump:" className="relative z-[3]" />
    </div>
  );
}
