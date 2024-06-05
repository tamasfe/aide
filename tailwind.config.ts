import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: ["./pages/**/*.vue", "./components/**/*.vue"],
  theme: {
    fontSize: {
      base: "var(--giro-font-size)",
      xs: "0.75rem",
      sm: "0.875rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
      "9xl": "8rem",
    },
    extend: {
      colors: {
        default: "var(--giro-bg)",
        emphasis: "var(--giro-bg-emphasis)",
        subtle: "var(--giro-bg-subtle)",
        button: {
          primary: "var(--giro-button-primary)",
          "primary-hover": "var(--giro-button-primary-hover)",
          secondary: "var(--giro-button-secondary)",
          "secondary-hover": "var(--giro-button-secondary-hover)",
          emphasis: "var(--giro-button-emphasis)",
          "emphasis-hover": "var(--giro-button-emphasis-hover)",
        },
      },

      backgroundImage: {
        "button-primary": "var(--giro-button-primary)",
        "button-primary-hover": "var(--giro-button-primary-hover)",
        "button-secondary": "var(--giro-button-secondary)",
        "button-secondary-hover": "var(--giro-button-secondary-hover)",
        "button-emphasis": "var(--giro-button-emphasis)",
        "button-emphasis-hover": "var(--giro-button-emphasis-hover)",
      },

      borderColor: {
        btn: {
          emphasis: "var(--giro-border-btn-emphasis)",
          primary: "var(--giro-border-btn-primary)",
        },
        focus: "var(--giro-border-focus)",
      },

      boxShadow: {
        "btn-emphasis": "var(--giro-shadow-btn-emphasis)",
        "btn-primary": "var(--giro-shadow-btn-primary)",
      },

      textColor: {
        default: "var(--giro-text)",
        subtle: "var(--giro-text-subtle)",
        emphasis: "var(--giro-text-emphasis)",
        button: {
          primary: "var(--giro-button-text-primary)",
          secondary: "var(--giro-button-text-secondary)",
          emphasis: "var(--giro-button-text-emphasis)",
        },
      },

      fill: {
        default: "var(--giro-text)",
        subtle: "var(--giro-text-subtle)",
        emphasis: "var(--giro-text-emphasis)",
        button: {
          primary: "var(--giro-button-text-primary)",
          secondary: "var(--giro-button-text-secondary)",
          emphasis: "var(--giro-button-text-emphasis)",
        },
      },

      borderRadius: {
        default: "var(--giro-border-radius)",
      },

      padding: {
        button: "var(--giro-padding-button)",
        "button-big": "var(--giro-padding-button-big)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
