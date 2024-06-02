import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    "./pages/**/*.vue",
    "./components/**/*.vue",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
