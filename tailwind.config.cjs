/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      primary: {
        dark: "#2c2a5c",
        med: "#434280",
        "med-dark": "#373669",
        light: "#A3A5D7",
      },
      secondary: {
        dark: "#167B8D",
        med: "#00C6C5",
        "med-light": "#00c9c8",
        "med-dark": "#00b3b2",
        light: "#B3FFFF",
      },
      warning: {
        dark: "#7b6b32",
        med: "#F4D35E",
        light: "#f3eac9",
      },
      danger: {
        dark: "#961737",
        med: "#DA4167",
        light: "#e58099",
      },
    },
  },
  plugins: [],
};

module.exports = config;
