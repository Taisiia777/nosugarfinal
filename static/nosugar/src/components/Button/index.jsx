// import React from "react";
// import PropTypes from "prop-types";

// const shapes = {
//   round: "rounded-[13px]",
// };

// const variants = {
//   fill: {
//     light_green_900: "bg-light_green-900 text-white-a700",
//     green_100: "bg-green-100 text-black-900",
//   },
// };

// const sizes = {
//   lg: "h-[100px] px-[35px] text-4xl",
//   md: "h-[76px] px-[35px] text-xl",
//   sm: "h-[34px] px-[17px] text-base",
//   xs: "h-[25px] px-[11px] text-xs",
// };

// const Button = ({
//   children,
//   className = "",
//   leftIcon,
//   rightIcon,
//   shape,
//   variant = "fill",
//   size = "xs",
//   color = "green_100",
//   ...restProps
// }) => {
//   return (
//     <button
//       className={`${className} flex flex-row items-center justify-center text-center cursor-pointer font-bold ${
//         (shape && shapes[shape]) || ""
//       } ${(size && sizes[size]) || ""} ${(variant && variants[variant]?.[color]) || ""}`}
//       {...restProps}
//     >
//       {!!leftIcon && leftIcon}
//       {children}
//       {!!rightIcon && rightIcon}
//     </button>
//   );
// };

// Button.propTypes = {
//   className: PropTypes.string,
//   children: PropTypes.node,
//   leftIcon: PropTypes.node,
//   rightIcon: PropTypes.node,
//   shape: PropTypes.oneOf(["round"]),
//   size: PropTypes.oneOf(["lg", "md", "sm", "xs"]),
//   variant: PropTypes.oneOf(["fill"]),
//   color: PropTypes.oneOf(["light_green_900", "green_100"]),
// };

// export { Button };
import React from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-[13px]",
};

const variants = {
  fill: {
    light_green_900: "bg-light_green-900 text-white-a700",
    green_100: "bg-green-100 text-black-900",
  },
};

const sizes = {
  lg: "h-[100px] px-[35px] text-4xl",
  md: "h-[76px] px-[35px] text-xl",
  sm: "h-[34px] px-[17px] text-base",
  xs: "h-[25px] px-[11px] text-xs",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "xs",
  color = "green_100",
  href,
  ...restProps
}) => {
  const commonClasses = `${className} flex flex-row items-center justify-center text-center cursor-pointer font-bold ${
    (shape && shapes[shape]) || ""
  } ${(size && sizes[size]) || ""} ${(variant && variants[variant]?.[color]) || ""}`;

  if (href) {
    return (
      <a href={href} className={commonClasses} {...restProps}>
        {!!leftIcon && leftIcon}
        {children}
        {!!rightIcon && rightIcon}
      </a>
    );
  }

  return (
    <button className={commonClasses} {...restProps}>
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["lg", "md", "sm", "xs"]),
  variant: PropTypes.oneOf(["fill"]),
  color: PropTypes.oneOf(["light_green_900", "green_100"]),
  href: PropTypes.string, // Добавляем поддержку href
};

export { Button };
