const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors:{
        primary: '#202225',
        secondary: '#5865f2',
        gray: colors.trueGray,
        gray: {
          900: '#202225',
          900: '#2f3136',
          900: '#36393f',
          900: '#4f545c',
          900: '#d4d7dc',
          900: '#e3e538',
          900: '#3bedef',
          900: '#f2f3f5',
        }

      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
