module.exports = {
    mode: 'jit',
    content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}", "./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
    darkMode: 'class',
    theme: {
      screens: { lg: { max: "1440px" }, md: { max: "1050px" }, sm: { max: "550px" } },
      extend: {
        colors: {
          black: { 900: "#000000" },
          deep_orange: { 100: "#ffbb2b" },
          green: { 100: "#fff" },
          light_green: { 900: "#3f451c", 900_87: "#3f451c87" },
          white: { a700: "#ffffff", a700_19: "#ffffff19", a700_66: "#ffffff66", a700_7f: "#ffffff7f" }
        },
        boxShadow: {},
        fontFamily: { manrope: "Manrope" }
      },
    },
    plugins: [require("@tailwindcss/forms")],
  };
  