module.exports = {
  content: [
    './pages/**/*.vue',
    './components/**/*.vue'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat']
      },
      colors: {
        'body-bg': '#1C1E28'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
