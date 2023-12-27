/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lobster: "'Lobster Two', sans-serif",
        robato: "'Roboto', sans-serif"
      }
    },
  },
  plugins: [require("daisyui")],
}

