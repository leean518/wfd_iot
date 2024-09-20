import { Helmet } from "react-helmet";
import { Heading, Img } from "../../components";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import WaterQualityDashboard from "../../components/WaterQualityDashboard";
import React, { useEffect } from "react";

export default function DashboardScreenPage() {
  //document.getElementById('header-title').innerHTML = 'Dashboard';
  useEffect(() => {
    const menuItem = document.getElementById('main-page-nav');
    if (menuItem) {
      menuItem.style.color = '#2d60ff';
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="w-full bg-white-a700">
        <div className="mt-[26px] flex items-start gap-[22px]">
          <Sidebar1 />
          <div className="flex flex-1 flex-col gap-3.5 self-center sm:gap-3.5">
            <Header />
            <div className="flex flex-col gap-2 bg-gray-100 p-3.5 sm:gap-2">
              <div className="mx-1.5 flex flex-col items-start sm:mx-0">
                <Heading
                  size="headingxs"
                  as="h1"
                  className="text-[18px] font-semibold text-blue_gray-800 sm:text-[15px]"
                >
                  Stage Statistics
                </Heading>
                <Heading
                  size="headingxs"
                  as="h2"
                  className="relative mt-[-22px] text-[18px] font-semibold text-blue_gray-800 sm:text-[15px]"
                >
                  Stage Statistics
                </Heading>
              </div>
              <div className="mb-[72px] ml-2.5 sm:ml-0">
                <div className="flex flex-col gap-14 sm:gap-7">
                  <div className="flex gap-9">
                    <div className="flex w-[32%] justify-center rounded-[20px] bg-white-a700 p-1.5">
                      <div className="mb-7 flex w-full flex-col items-center gap-2 sm:w-full sm:gap-2">
                        <Heading
                          size="texts"
                          as="h3"
                          className="text-[16px] font-medium text-blue_gray-800 sm:text-[13px]"
                        >
                          Primary Intake Chamber:
                        </Heading>
                        <Heading
                          as="h4"
                          className="ml-[42px] self-start text-[12px] font-medium text-blue_gray-800 sm:ml-0"
                        >
                          Water Level (m):{" "}
                        </Heading>
                        <div className="flex items-center">
                          <Heading as="h5" className="text-[12px] font-medium text-blue_gray-800">
                            5.2
                          </Heading>
                          <Img
                            src="images/img_contrast.svg"
                            alt="Contrast"
                            className="relative ml-[-14px] h-[60px] w-[62%] rounded-[14px] object-contain"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ml-9 flex flex-1 gap-[38px]">
                      <WaterQualityDashboard className="rounded-[20px] bg-white-a700" />
                      <WaterQualityDashboard />
                    </div>
                  </div>
                  <div className="flex justify-between gap-5">
                    <div className="flex w-[32%] justify-center rounded-[20px] bg-white-a700 p-3">
                      <div className="mb-3 flex w-full flex-col items-center gap-3.5 sm:w-full sm:gap-3.5">
                        <Heading
                          size="texts"
                          as="h6"
                          className="text-[16px] font-medium text-blue_gray-800 sm:text-[13px]"
                        >
                          Dechlorination Chamber:
                        </Heading>
                        <div className="ml-2.5 mr-1 flex items-center gap-[26px] self-stretch sm:mx-0">
                          <div className="flex w-[36%] flex-col items-center gap-2.5 sm:gap-2.5">
                            <Heading as="p" className="text-[12px] font-medium text-blue_gray-800">
                              pH Level:
                            </Heading>
                            <div className="flex items-center justify-center self-stretch">
                              <Heading as="p" className="text-[12px] font-medium text-blue_gray-800">
                                6.34
                              </Heading>
                              <Img
                                src="images/img_contrast.svg"
                                alt="Contrast"
                                className="relative ml-[-14px] h-[60px] w-[42%] rounded-[14px] object-contain"
                              />
                            </div>
                          </div>
                          <div className="relative h-[82px] flex-1 content-end sm:h-auto">
                            <Heading
                              as="p"
                              className="mb-[22px] ml-auto mr-10 text-[12px] font-medium text-blue_gray-800 sm:mr-0"
                            >
                              2
                            </Heading>
                            <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max flex-1 flex-col items-center gap-1.5 sm:gap-1.5">
                              <Heading as="p" className="text-[12px] font-medium text-blue_gray-800">
                                Water Level (m):
                              </Heading>
                              <div className="ml-3.5 mr-[18px] h-[60px] w-[60px] rotate-[-90deg] rounded-[30px] bg-teal-a400 sm:mx-0" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mr-[62px] flex w-[54%] justify-center rounded-bl-[36px] rounded-br-[20px] rounded-tl-[20px] rounded-tr-[36px] bg-white-a700 px-2 py-2.5">
                      <div className="mb-3 flex w-full flex-col items-center gap-3.5 sm:w-full sm:gap-3.5">
                        <Heading
                          size="texts"
                          as="p"
                          className="text-[16px] font-medium text-blue_gray-800 sm:text-[13px]"
                        >
                          Quality Monitoring Chamber:
                        </Heading>
                        <div className="flex items-center self-stretch">
                          <div className="flex w-[18%] flex-col items-end gap-2.5 sm:gap-2.5">
                            <Heading as="p" className="text-[12px] font-medium text-blue_gray-800">
                              pH Level:
                            </Heading>
                            <div className="relative h-[60px] content-center self-stretch sm:h-auto">
                              <Heading as="p" className="mx-auto text-[12px] font-medium text-blue_gray-800">
                                6.34
                              </Heading>
                              <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[60px] w-[60px] rotate-[-90deg] rounded-[30px] bg-teal-a400" />
                            </div>
                          </div>
                          <div className="relative h-[82px] w-[38%] content-end sm:h-auto">
                            <Heading
                              as="p"
                              className="mb-[22px] ml-auto mr-10 text-[12px] font-medium text-blue_gray-800 sm:mr-0"
                            >
                              2
                            </Heading>
                            <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max flex-1 flex-col items-end gap-1.5 sm:gap-1.5">
                              <Heading as="p" className="text-[12px] font-medium text-blue_gray-800">
                                Water Level (m):
                              </Heading>
                              <div className="mr-[18px] h-[60px] w-[60px] rotate-[-90deg] rounded-[30px] bg-teal-a400 sm:mr-0" />
                            </div>
                          </div>
                          <div className="ml-3.5 flex flex-1 flex-col items-center gap-2.5 sm:gap-2.5">
                            <Heading as="p" className="self-end text-[12px] font-medium text-blue_gray-800">
                              Water Temperature (°F)
                            </Heading>
                            <div className="relative h-[60px] w-[40%] content-center sm:h-auto">
                              <Heading as="p" className="mx-auto text-[12px] font-medium text-blue_gray-800">
                                65
                              </Heading>
                              <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[60px] w-[60px] rotate-[-90deg] rounded-[30px] bg-teal-a400" />
                            </div>
                          </div>
                        </div>
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
