/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      primary: {
        dark: "#292B4C",
        med: "#3D3F71",
        light: "#A3A5D7",
      },
      secondary: {
        dark: "#167B8D",
        med: "#00C6C5",
        light: "#B3FFFF",
      },
      warning: "#EBD652",
      danger: "#D7234A",
    },
  },
  plugins: [],
};

module.exports = config;
