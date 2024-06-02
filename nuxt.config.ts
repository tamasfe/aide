// https://nuxt.com/docs/api/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no, shrink-to-fit=no",
    },
    rootId: "app",
  },
  build: {
    transpile: ["applicationinsights"],
  },
  debug: false,
  devtools: {
    enabled: true,
  },
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "@nuxtjs/seo",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
  ],
  runtimeConfig: {
    public: {},
  },
  site: {
    url: "https://girobet.vip",
    name: "GiroBet",
    // description: "Welcome to my awesome site!", // TODO
    // defaultLocale: "en", // TODO not needed if you have @nuxtjs/i18n installed
  },
  ssr: true,
  typescript: {
    strict: true,
    typeCheck: true,
  },
  // @nuxtjs/eslint
  eslint: {
    config: {
      stylistic: {
        arrowParens: false,
        blockSpacing: true,
        braceStyle: "stroustrup",
        commaDangle: "always-multiline",
        jsx: false,
        quoteProps: "as-needed",
        quotes: "double",
        semi: true,
      },
    },
  },
  // @nuxtjs/i18n
  i18n: {
    langDir: "locales/",
    locales: [
      {
        iso: "en-US",
        code: "en",
        file: "en.json",
      },
      {
        iso: "pt-BR",
        code: "pt",
        file: "pt.json",
      },
    ],
    detectBrowserLanguage: false,
    strategy: "no_prefix",
    lazy: false,
    defaultLocale: "en",
    vueI18n: "./i18n.config.ts",
  },
  // @pinia/nuxt
  pinia: {
    storesDirs: ["./store/**"],
  },
});
