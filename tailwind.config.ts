import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    "./pages/**/*.vue",
    "./components/**/*.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat"],
      },
      colors: {
        "body-bg": "#1c1e28",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
