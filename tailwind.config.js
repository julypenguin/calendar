module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        "144": "36rem",
        "176": "44rem",
      },
      padding: {
        "144": "36rem",
        "176": "44rem",
      }
    },
    // container: {
    //   center: true,
    // },
  },
  variants: {
    extend: {},
  }
  // plugins: [
  //   require('@tailwindcss/forms'),
  // ],
}
