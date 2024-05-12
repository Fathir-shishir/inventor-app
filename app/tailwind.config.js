/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "valeo-green": "#82e600",
        "valeo-green-hover": "#8AF302",
        "valeo-blue": "#4e6b7c",
        "valeo-blue-hover": "#668496",
      },
      screens: {
        "3xl": "1920px"
      }
    },
  },
  plugins: [],
}