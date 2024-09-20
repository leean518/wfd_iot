import { Img, Heading, Text } from "./..";
import React from "react";

export default function Footer({ ...props }) {
  return (
    <footer {...props} className={`${props.className} flex flex-col mb-1.5 gap-3 px-[18px] sm:gap-3`}>
      <Heading size="headingxs" as="h5" className="text-[22px] font-semibold text-blue_gray-800 sm:text-[18px]">
        Water Level History
      </Heading>
      <div className="mx-auto flex w-full max-w-[742px] self-stretch rounded-[24px] bg-white-a700 p-[26px] sm:p-5">
        <div className="relative h-[218px] w-full">
          <div className="absolute bottom-[0.27px] left-0 right-0 my-auto ml-6 mr-auto flex flex-1 flex-col items-center sm:ml-0">
            <div className="h-[184px] self-stretch bg-[url(/public/images/img_group_3.svg)] bg-cover bg-no-repeat sm:h-auto">
              <Img src="images/img_vector.png" alt="Vector" className="h-[176px] w-full object-cover sm:h-auto" />
            </div>
            <div className="mx-[90px] flex justify-between gap-5 self-stretch sm:mx-0">
              <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
              <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
              <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
              <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
              <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
              <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
            </div>
            <div className="flex w-[90%] flex-wrap justify-between gap-5 self-start sm:w-full">
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
          <div className="absolute left-0 top-0 m-auto w-[4%]">
            <div className="flex items-start justify-center gap-2">
              <Text as="p" className="self-center text-[13px] font-normal text-indigo-300">
                8
              </Text>
              <div className="mt-1.5 h-px w-[6px] bg-indigo-300" />
            </div>
            <div className="mt-[26px] flex items-start justify-between gap-5">
              <div className="flex flex-col items-center gap-[26px] sm:gap-[26px]">
                <Text as="p" className="text-[13px] font-normal text-indigo-300">
                  6
                </Text>
                <Text as="p" className="text-[13px] font-normal text-indigo-300">
                  4
                </Text>
                <Text as="p" className="text-[13px] font-normal text-indigo-300">
                  2
                </Text>
              </div>
              <div className="mt-2 flex flex-1 flex-col items-start self-end">
                <div className="h-px w-[6px] bg-indigo-300" />
                <div className="flex items-center self-stretch">
                  <div className="mb-[26px] flex w-[42%] flex-col gap-11 self-end sm:gap-11">
                    <div className="h-px w-[6px] bg-indigo-300" />
                    <div className="h-px w-[6px] bg-indigo-300" />
                  </div>
                  <Heading
                    size="textxs"
                    as="p"
                    className="relative ml-[-4px] w-[56%] rotate-[-90deg] text-right text-[12px] font-normal leading-[14px] text-indigo-300 sm:w-[56%]"
                  >
                    Water Level (m)
                  </Heading>
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-end justify-center">
              <Heading size="textxs" as="p" className="self-center text-[12px] font-normal text-indigo-300">
                0
              </Heading>
              <div className="mb-1.5 ml-2 h-px w-[6px] flex-1 bg-indigo-300" />
              <Img src="images/img_group.svg" alt="Image" className="h-[4px]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
