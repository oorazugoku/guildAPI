/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        publicSans: ['Public Sans']
      }
    },
    colors: {
      'prussian-blue': {
        '50': 'white',
        '100': '#e6ebee',
        '200': '#bfcdd5',
        '300': '#99afbb',
        '400': '#4d7288',
        '500': '#003655',
        '600': '#00314d',
        '700': '#002940',
        '800': '#002033',
        '900': '#001a2a'
    }
    }
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
  variants: {
    scrollbar: ['rounded']
}
}
