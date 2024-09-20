import { Heading } from "./..";
import React from "react";

export default function WaterQualityDashboard({
  gritChamberText = "Grit Chamber:",
  tdsLevelText = "TDS Level (ppm):",
  tdsValueText = "6.34",
  waterLevelText = "Water Level (m):",
  waterLevelValue = "2",
  ...props
}) {
  return (
    <div {...props} className={`${props.className} flex items-start w-[50%] p-1.5`}>
      <div className="mb-[26px] flex w-full flex-col items-center gap-3.5">
        <Heading size="texts" as="p" className="text-[16px] font-medium text-blue_gray-800">
          {gritChamberText}
        </Heading>
        <div className="flex gap-2 self-stretch">
          <div className="flex w-full flex-col items-center gap-1.5">
            <Heading as="p" className="text-[12px] font-medium text-blue_gray-800">
              {tdsLevelText}
            </Heading>
            <div className="relative ml-[18px] mr-5 h-[60px] content-center self-stretch">
              <Heading as="p" className="mx-auto text-[12px] font-medium text-blue_gray-800">
                {tdsValueText}
              </Heading>
              <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[60px] w-[60px] rotate-[-90deg] rounded-[30px] bg-teal-a400" />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-1.5">
            <Heading as="p" className="text-[12px] font-medium text-blue_gray-800">
              {waterLevelText}
            </Heading>
            <div className="mx-4 flex w-[60px] flex-col items-center justify-center rounded-[30px] bg-teal-a400">
              <Heading as="p" className="text-[12px] font-medium text-blue_gray-800">
                {waterLevelValue}
              </Heading>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
