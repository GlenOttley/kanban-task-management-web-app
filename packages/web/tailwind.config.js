/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      purple: 'hsl(242, 48%, 58%)',
      'purple-hover': 'hsl(243, 100%, 82%)',
      black: 'hsl(237, 100%, 4%)',
      'grey-very-dark': 'hsl(235, 16%, 15%)',
      'grey-dark': 'hsl(235, 12%, 19%)',
      'lines-dark': 'hsl(236, 11%, 27%)',
      'grey-medium': 'hsl(216, 15%, 57%)',
      'lines-light': 'hsl(221, 69%, 94%)',
      'grey-light': 'hsl(220, 69%, 97%)',
      white: 'hsl(0, 0%, 100%)',
      red: 'hsl(0, 78%, 63%)',
      'red-hover': 'hsl(0, 100%, 80%)',
    },
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'sans-serif'],
    },
    container: {
      padding: {
        DEFAULT: '16px',
      },
    },
    extend: {},
  },
  plugins: [],
}
