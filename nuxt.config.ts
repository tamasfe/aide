// https://nuxt.com/docs/api/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport:
        "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no, shrink-to-fit=no",
    },
    rootId: "app",
  },
  build: {
    transpile: ["applicationinsights"],
  },
  compatibilityDate: "2024-07-03",
  debug: false,
  devtools: {
    enabled: true,
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils/module",
    "@nuxtjs/device",
    "@nuxtjs/i18n",
    "@nuxtjs/seo",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:3050",
    },
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
  // NOTE
  // https://github.com/nuxt/nuxt/issues/27544
  // when this issue is fixed, the entire "vite" block below can be removed
  vite: {
    optimizeDeps: {
      exclude: ["vee-validate"],
    },
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
        language: "en-US",
        code: "en",
        file: "en.json",
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
