import { Helmet } from "react-helmet";
import { Img, Text, Heading } from "../../components";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import WaterIntakeSwitch from "../../components/WaterIntakeSwitch";
import React, { useEffect } from "react";

export default function PrimaryIntakeScreenPage() {
  useEffect(() => {
    document.getElementById('header-title').innerHTML = 'Primary Intake Controls';
    const menuItem = document.getElementById('primary-intake-nav');
    if (menuItem) {
      menuItem.style.color = '#2d60ff';
    }
  }, []);

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
                <WaterIntakeSwitch />
                <Img
                  src="images/img_carret_right.svg"
                  alt="Carretright"
                  className="mb-5 mt-9 h-[100px] w-[14%] rounded-[40px] object-contain"
                />
                <WaterIntakeSwitch waterIntakeText="Water Level (m):" />
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
                    <div className="absolute bottom-[0.27px] left-0 right-0 m-auto flex flex-1 flex-col items-center">
                      <div className="flex h-[184px] items-center self-end bg-[url(/public/images/img_group_3.svg)] bg-cover bg-no-repeat sm:h-auto">
                        <Img
                          src="images/img_vector.png"
                          alt="Vector"
                          className="h-[176px] w-full object-cover sm:h-auto"
                        />
                      </div>
                      <div className="mx-[90px] flex justify-between gap-5 self-stretch sm:mx-0">
                        <Img src="images/img_group.svg" alt="Image" className="ml-11 h-[4px]" />
                        <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
                        <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
                        <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
                        <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
                        <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
                      </div>
                      <div className="ml-[42px] mr-[60px] flex flex-wrap justify-between gap-5 self-stretch sm:mx-0">
                        <Text size="textmd" as="p" className="self-end text-[14px] font-normal text-indigo-300">
                          1 week
                        </Text>
                        <Text size="textmd" as="p" className="text-[14px] font-normal text-indigo-300">
                          1 hour
                        </Text>
                        <Text size="textmd" as="p" className="self-end text-[14px] font-normal text-indigo-300">
                          Now
                        </Text>
                      </div>
                    </div>
                    <div className="absolute left-0 right-0 top-0 mx-[18px] my-auto flex-1 sm:mx-0">
                      <div className="flex items-start gap-[9px]">
                        <Text as="p" className="self-center text-[13px] font-normal text-indigo-300">
                          8
                        </Text>
                        <div className="mt-1.5 h-px w-[6px] bg-indigo-300" />
                      </div>
                      <div className="mt-[26px]">
                        <div className="relative z-[2] flex items-center gap-[9px]">
                          <Text as="p" className="text-[13px] font-normal text-indigo-300">
                            6
                          </Text>
                          <div className="h-px w-[6px] bg-indigo-300" />
                        </div>
                        <div className="relative mt-[-6px] flex items-start">
                          <div className="relative z-[1] mt-[34px] flex w-[4%] items-center justify-center gap-2">
                            <Text as="p" className="text-[13px] font-normal text-indigo-300">
                              4
                            </Text>
                            <div className="h-px w-[6px] bg-indigo-300" />
                          </div>
                          <div className="relative ml-[-24px] flex flex-1 items-center self-center">
                            <div className="mb-[18px] flex w-[4%] items-center gap-2 self-end">
                              <Text as="p" className="text-[13px] font-normal text-indigo-300">
                                2
                              </Text>
                              <div className="mb-1.5 h-px w-[6px] self-end bg-indigo-300" />
                            </div>
                            <Text
                              size="textxs"
                              as="p"
                              className="relative ml-[-4px] w-[2%] rotate-[-90deg] text-right text-[12px] font-normal leading-[14px] text-indigo-300 sm:w-[2%]"
                            >
                              Water Level (m)
                            </Text>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-end">
                        <Text size="textxs" as="p" className="self-center text-[12px] font-normal text-indigo-300">
                          0
                        </Text>
                        <div className="mb-1.5 ml-2 h-px w-[6px] bg-indigo-300" />
                        <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
                      </div>
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
