module.exports = {
  mode: "jit",
  content: ["./src/**/**/*.{js,ts,jsx,tsx,html,mdx}", "./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    screens: { sm: { max: "550px" } },
    extend: {
      colors: {
        blue: { a700: "var(--blue_a700)" },
        blue_gray: { 800: "var(--blue_gray_800)" },
        gray: { 100: "var(--gray_100)", 400: "var(--gray_400)" },
        teal: { a400: "var(--teal_a400)" },
        white: { a700: "var(--white_a700)" },
      },
      boxShadow: {},
      fontFamily: { inter: "Inter" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
