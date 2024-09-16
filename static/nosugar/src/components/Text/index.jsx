import React from "react";

const sizes = {
  textxs: "text-xs font-thin",
  textsm: "text-base font-thin lg:text-[13px]",
  textmd: "text-xl font-thin lg:text-[17px]",
};

const Text = ({ children, className = "", as, size = "textxs", ...restProps }) => {
  const Component = as || "p";
  return (
    <Component className={`text-white-a700 font-manrope ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
