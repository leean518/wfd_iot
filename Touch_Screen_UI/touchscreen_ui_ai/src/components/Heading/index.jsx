import React from "react";

const sizes = {
  textxs: "text-[12px] font-medium",
  texts: "text-[16px] font-medium sm:text-[13px]",
  headingxs: "text-[18px] font-semibold sm:text-[15px]",
  headings: "text-[25px] font-semibold sm:text-[21px]",
};

const Heading = ({ children, className = "", size = "textxs", as, ...restProps }) => {
  const Component = as || "h6";

  return (
    <Component className={`text-blue_gray-800 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };
