import { Helmet } from "react-helmet";
import { Heading, Img } from "../../components";
import Header from "../../components/Header";
import Sidebar1 from "../../components/Sidebar1";
import React, { useEffect } from "react";

export default function ChlorinationChamberScreenPage() {
  useEffect(() => {
    document.getElementById('header-title').innerHTML = 'Chlorination Chamber Controls';
    const menuItem = document.getElementById('chlorination-chamber-nav');
    if (menuItem) {
      menuItem.style.color = '#2d60ff';
    }
  }, []);
  return (
    <>
      <Helmet>
        <title>Chlorination chamber screen</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="w-full bg-white-a700">
        <div className="mt-[26px] flex items-start gap-[22px]">
          <Sidebar1 />
          <div className="flex flex-1 flex-col gap-3.5 self-center sm:gap-3.5">
            <Header />
            <div>
              <div className="bg-gray-100 px-[18px] py-9 sm:py-5">
                <div className="mb-[52px] flex flex-col items-center gap-1 sm:gap-1">
                  <div className="mr-2 flex self-stretch sm:mr-0">
                    <div className="flex flex-1 items-center">
                      <div className="flex flex-1 flex-col items-center gap-[30px] rounded-[18px] bg-white-a700 p-2 sm:gap-[30px]">
                        <Heading as="h1" className="self-end text-[16px] font-medium text-blue_gray-800 sm:text-[13px]">
                          Water Intake Pump:
                        </Heading>

                      </div>
                      <Img
                        src="images/img_carret_right.svg"
                        alt="Carretright"
                        className="relative ml-[-24px] h-[100px] w-[100px] rounded-[40px]"
                      />
                    </div>
                    <div className="flex flex-1 items-center">
                      <div className="relative z-[1] flex flex-1 flex-col items-start rounded-[18px] bg-white-a700 px-[26px] py-2 sm:px-5">
                        <div className="relative z-[2] self-stretch">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-[38px] sm:gap-[38px]">
                              <Heading
                                as="h2"
                                className="self-end text-[16px] font-medium text-blue_gray-800 sm:text-[13px]"
                              >
                                <>
                                  pH
                                  <br />
                                  Level:
                                </>
                              </Heading>
                              <Heading size="textxs" as="h3" className="text-[12px] font-medium text-blue_gray-800">
                                6.7
                              </Heading>
                            </div>
                            <div className="flex flex-1 flex-col items-end gap-3.5 self-center sm:gap-3.5">
                              <Heading
                                as="h4"
                                className="text-center text-[16px] font-medium leading-[19px] text-blue_gray-800 sm:text-[13px]"
                              >
                                <>
                                  Water <br />
                                  Level (m):
                                </>
                              </Heading>
                              <div className="mr-1.5 flex h-[60px] w-[42%] flex-col items-start justify-center rounded-[14px] bg-[url(/public/images/img_group_2.svg)] bg-cover bg-no-repeat py-[22px] sm:mr-0 sm:h-auto sm:w-full sm:py-5">
                                <Heading size="textxs" as="h5" className="text-[12px] font-medium text-blue_gray-800">
                                  2
                                </Heading>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Img
                          src="images/img_group_2.svg"
                          alt="Contrast"
                          className="relative mb-[22px] ml-[26px] mt-[-60px] h-[60px] w-[24%] rounded-[14px] object-contain sm:ml-0"
                        />
                      </div>
                      <Img
                        src="images/img_carret_right.svg"
                        alt="Carretright"
                        className="relative ml-[-26px] h-[100px] w-[100px] rounded-[40px]"
                      />
                    </div>
                    <div className="flex w-[26%] flex-col items-center gap-[30px] rounded-[18px] bg-white-a700 p-2 sm:gap-[30px]">
                      <Heading as="h6" className="self-end text-[16px] font-medium text-blue_gray-800 sm:text-[13px]">
                        Water Outtake Pump:
                      </Heading>
                    </div>
                  </div>
                  <div className="w-[26%] sm:w-full">
                    <Img
                      src="images/img_carret_right_blue_a700.svg"
                      alt="Carretright"
                      className="relative z-[3] ml-[52px] mr-[46px] h-[100px] w-[100px] rounded-[40px] sm:mx-0"
                    />
                    <div className="relative mt-[-26px] flex flex-col items-center justify-center gap-[26px] rounded-[18px] bg-white-a700 px-3 py-6 sm:gap-[26px] sm:py-5">
                      <Heading as="p" className="self-end text-[16px] font-medium text-blue_gray-800 sm:text-[13px]">
                        Acidic Solution Pump:
                      </Heading>
                      <div className="ml-8 mr-[38px] flex justify-end self-stretch rounded-[24px] bg-light_green-500 p-1 sm:mx-0">
                        <div className="h-[38px] w-[36px] rounded-[18px] bg-gradient" />
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
