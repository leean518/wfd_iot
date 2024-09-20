import { Heading } from "./..";
import React from "react";

export default function WaterIntakeSwitch({ waterIntakeText = "Water Intake Pump:", ...props }) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[28%] gap-[30px] p-2 sm:gap-[30px] bg-white-a700 rounded-[18px]`}
    >
      {/* <Heading as="p" className="self-end text-[16px] font-medium text-blue_gray-800">
        {waterIntakeText}
      </Heading>
      <Switch value={true} className="mb-[42px]" /> */}
    </div>
  );
}
