module.exports = {
  purge: ["./src/client/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#292740", lighter: "#F1F4FF" },
        secondary: { DEFAULT: "#E8AC00", lighter: "#FFF9E9" },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
