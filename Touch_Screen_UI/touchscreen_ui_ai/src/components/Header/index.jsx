import { Img, Heading } from "./..";
import React from "react";

export default function Header({ ...props }) {
  return (
    <header {...props} className={`${props.className} flex items-center ml-8 mr-2.5 sm:mx-0 bg-white-a700 `}>
      <div className="w-full sm:w-full">
        <div className="flex items-center justify-between gap-5">
          <Heading id='header-title' size="headings" as="h4" className="text-[25px] font-semibold text-blue_gray-800 sm:text-[21px]">
            Overview
          </Heading>
          <a href="#">
            <Img
              src="images/img_pexels_christin.png"
              alt="Pexelschristin"
              className="h-[44px] w-[44px] rounded-[22px] object-cover"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
