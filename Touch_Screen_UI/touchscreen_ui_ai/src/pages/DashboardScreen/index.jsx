import { Helmet } from "react-helmet";
import { Heading, Img } from "../../components";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import WaterQualityDashboard from "../../components/WaterQualityDashboard";
import React, { useEffect } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashboardScreenPage() {
  const getWheelColor = (value) => {
    if (value < 50) return 'green';
    if (value < 70) return 'orange';
    return 'red';
  };
  useEffect(() => {
    document.getElementById('header-title').innerHTML = 'Dashboard';
    const menuItem = document.getElementById('main-page-nav');
    if (menuItem) {
      menuItem.style.color = '#2d60ff';
    }
  }, []);

  let primaryIntakeLevel = 66;
  let gritWaterLevel = 66;
  let gritTDSLevel = 66;
  let chlorinationPHLevel = 20;
  let chlorinationWaterLevel = 51;
  let dechlorinationPHLevel = 20;
  let dechlorinationWaterLevel = 51;
  let qualityPHLevel = 51;
  let qualityWaterLevel = 91;
  let qualityTemp = 51;
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
                        <div className="flex justify-center items-center">
                          <Heading
                            as="h4"
                            className="text-[12px] font-medium text-blue_gray-800">
                            Water Level:{" "}
                          </Heading>
                        </div>
                        <br></br>
                        <div className="flex items-center" style={{ width: '150px', height: '150px' }}>
                          <CircularProgressbar value={primaryIntakeLevel} text={`${primaryIntakeLevel} m`} styles={buildStyles({
                              pathColor: getWheelColor(primaryIntakeLevel),
                              textColor: getWheelColor(primaryIntakeLevel),
                            })}/>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-[32%] justify-center rounded-[20px] bg-white-a700 p-1.5">
                      <div className="mb-7 flex w-full flex-col items-center gap-2 sm:w-full sm:gap-2">
                        <Heading
                          size="texts"
                          as="h3"
                          className="text-[16px] font-medium text-blue_gray-800 sm:text-[13px]"
                        >
                          Grit Chamber:
                        </Heading>
                        <div className="flex justify-center items-center gap-8">
                          <div className="flex flex-col items-center">
                            <Heading
                              as="h4"
                              className="text-[12px] font-medium text-blue_gray-800">
                              Water Level:{" "}
                            </Heading>
                            <br></br>
                            <div className="flex items-center" style={{ width: '150px', height: '150px' }}>
                              <CircularProgressbar value={gritWaterLevel} text={`${gritWaterLevel} m`} styles={buildStyles({
                                pathColor: getWheelColor(gritWaterLevel),
                                textColor: getWheelColor(gritWaterLevel),
                              })}/>
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <Heading
                              as="h4"
                              className="text-[12px] font-medium text-blue_gray-800">
                              TDS Level:{" "}
                            </Heading>
                            <br></br>
                            <div className="flex items-center" style={{ width: '155px', height: '155px' }}>
                              <CircularProgressbar value={gritTDSLevel} text={`${gritTDSLevel} ppm`} styles={buildStyles({
                                pathColor: getWheelColor(gritTDSLevel),
                                textColor: getWheelColor(gritTDSLevel),
                              })}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-[32%] justify-center rounded-[20px] bg-white-a700 p-1.5">
                      <div className="mb-7 flex w-full flex-col items-center gap-2 sm:w-full sm:gap-2">
                        <Heading
                          size="texts"
                          as="h3"
                          className="text-[16px] font-medium text-blue_gray-800 sm:text-[13px]"
                        >
                          Chlorination Chamber:
                        </Heading>
                        <div className="flex justify-center items-center gap-8">
                          <div className="flex flex-col items-center">
                            <Heading
                              as="h4"
                              className="text-[12px] font-medium text-blue_gray-800">
                              pH Level:{" "}
                            </Heading>
                            <br></br>
                            <div className="flex items-center" style={{ width: '150px', height: '150px' }}>
                              <CircularProgressbar value={chlorinationPHLevel} text={`${chlorinationPHLevel} `} styles={buildStyles({
                                pathColor: getWheelColor(chlorinationPHLevel),
                                textColor: getWheelColor(chlorinationPHLevel),
                              })}/>
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <Heading
                              as="h4"
                              className="text-[12px] font-medium text-blue_gray-800">
                              Water Level:{" "}
                            </Heading>
                            <br></br>
                            <div className="flex items-center" style={{ width: '155px', height: '155px' }}>
                              <CircularProgressbar value={chlorinationWaterLevel} text={`${chlorinationWaterLevel} m`} styles={buildStyles({
                                pathColor: getWheelColor(chlorinationWaterLevel),
                                textColor: getWheelColor(chlorinationWaterLevel),
                              })}/>
                            </div>
                          </div>
                        </div>
                      </div>
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
                            <Heading as="p" className="flex items-center text-[12px] font-medium text-blue_gray-800">
                              pH Level:
                            </Heading>
                            <div className="flex items-center justify-center self-stretch">
                              <div className="flex items-center" style={{ width: '150px', height: '150px' }}>
                                <CircularProgressbar value={dechlorinationPHLevel} text={`${dechlorinationPHLevel}`} styles={buildStyles({
                                  pathColor: getWheelColor(dechlorinationPHLevel),
                                  textColor: getWheelColor(dechlorinationPHLevel),
                                })}/>
                              </div>
                            </div>
                          </div>
                          <div className="flex w-[36%] flex-col items-center gap-2.5 sm:gap-2.5 ml-[40px]">
                            <Heading as="p" className="flex items-center text-[12px] font-medium text-blue_gray-800">
                              Water Level:
                            </Heading>
                            <div className="flex items-center justify-center self-stretch">
                              <div className="flex items-center" style={{ width: '150px', height: '150px' }}>
                                <CircularProgressbar value={dechlorinationWaterLevel} text={`${dechlorinationWaterLevel} m`} styles={buildStyles({
                                  pathColor: getWheelColor(dechlorinationWaterLevel),
                                  textColor: getWheelColor(dechlorinationWaterLevel),
                                })}/>
                              </div>
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
                        <div className="flex justify-center items-center gap-[60px]  ml-[80px] ">
                        <div className="flex items-center self-stretch">
                          <div className="flex w-[20%] flex-col items-center gap-2.5 sm:gap-2.5">
                            <Heading as="p" className="text-[12px] font-medium text-blue_gray-800">
                              pH Level:
                            </Heading>
                            <div className="flex items-center justify-center self-stretch">
                              <div className="flex items-center" style={{ width: '150px', height: '150px' }}>
                                <CircularProgressbar value={qualityPHLevel} text={`${qualityPHLevel}`} styles={buildStyles({
                                  pathColor: getWheelColor(qualityPHLevel),
                                  textColor: getWheelColor(qualityPHLevel),
                                })}/>
                              </div>
                            </div>
                          </div>
                          <div className="flex w-[20%] flex-col items-center gap-2.5 sm:gap-2.5 ml-[60px]">
                            <Heading as="p" className="text-[12px] font-medium text-blue_gray-800">
                              Water Level:
                            </Heading>
                            <div className="flex items-center justify-center self-stretch">
                              <div className="flex items-center" style={{ width: '150px', height: '150px' }}>
                                <CircularProgressbar value={qualityWaterLevel} text={`${qualityWaterLevel} m`} styles={buildStyles({
                                  pathColor: getWheelColor(qualityWaterLevel),
                                  textColor: getWheelColor(qualityWaterLevel),
                                })}/>
                              </div>
                            </div>
                          </div>

                          <div className="flex w-[20%] flex-col items-center gap-2.5 sm:gap-2.5 ml-[60px]">
                            <Heading as="p" className="text-[12px] font-medium text-blue_gray-800">
                              Water Temperature:
                            </Heading>
                            <div className="flex items-center justify-center self-stretch">
                              <div className="flex items-center" style={{ width: '150px', height: '150px' }}>
                                <CircularProgressbar value={qualityTemp} text={`${qualityTemp} °F`} styles={buildStyles({
                                  pathColor: getWheelColor(qualityTemp),
                                  textColor: getWheelColor(qualityTemp),
                                })}/>
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
        </div>
      </div>
    </>
  );
}
