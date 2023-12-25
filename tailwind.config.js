/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './components/**/*.{html,js,jsx}',
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animated')
    ],
}