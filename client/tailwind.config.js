/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "yahoo-purple": "#410093",
        "yahoo-white": "#F3F3F3",
        "yahoo-grey": "#636262",
        "yahoo-light-purple": "#8DA4EC",
      },
      gridColumn: {
        "span-34": "span 34 / span 34",
        "span-29": "span 29 / span 29",
        "span-24": "span 24 / span 24",
      },
      gridRow: {
        "span-34": "span 34 / span 34",
        "span-29": "span 29 / span 29",
        "span-24": "span 24 / span 24",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};