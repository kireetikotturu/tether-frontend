/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1abc9c',
        darkbg: '#151a22',
        darkcard: '#222b3a',
        accent: '#2ecc71'
      }
    },
  },
  plugins: [],
}