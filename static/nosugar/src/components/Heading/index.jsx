import React from "react";

const sizes = {
  headingxxs: "text-[10px] font-bold",
  headingxs: "text-[8px] font-bold",
  headingxs: "text-xs font-bold",
  headingmd: "text-base font-bold lg:text-[13px]",
  headinglg: "text-xl font-bold lg:text-[17px]",
  headingxl: "text-[28px] font-bold lg:text-[23px] md:text-[26px] sm:text-2xl",
  heading2xl: "text-4xl font-bold lg:text-3xl md:text-[34px] sm:text-[32px]",
};

const Heading = ({ children, className = "", size = "headinglg", as, ...restProps }) => {
  const Component = as || "h6";
  return (
    <Component className={`text-white-a700 font-manrope ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };
