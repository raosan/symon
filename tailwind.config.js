module.exports = {
  purge: ["./src/client/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        bw: {
          darker: "#292929",
          dark: "#333333",
          DEFAULT: "#404040",
          light: "#C4C4C4",
          lighter: "#EEEEEE",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
