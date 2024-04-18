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
        "button-base": "#2F323C",
        "button-hover": "#42424D",
        "button-base-text": "#B8BDCB",
        "button-secondary": "#FFE649",
        "button-secondary-text": "#161421",
        "text-button": "#fff",
        "primary-text": "#fff",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
