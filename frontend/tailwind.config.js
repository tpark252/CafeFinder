/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'coffee': {
          50: '#fdf8f3',
          100: '#f9efdf',
          200: '#f2dbb9',
          300: '#e8c08a',
          400: '#db9d5a',
          500: '#d17d3a',
          600: '#c3672f',
          700: '#a24e29',
          800: '#834027',
          900: '#6b3522',
        },
        'cream': {
          50: '#fefcf9',
          100: '#fdf7ef',
          200: '#faebdc',
          300: '#f5d9c0',
          400: '#edc099',
          500: '#e3a06d',
          600: '#d58446',
          700: '#be6c39',
          800: '#975832',
          900: '#7b4a2c',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
