// https://nuxt.com/docs/api/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no, shrink-to-fit=no",
    },
    rootId: "app",
  },
  debug: false,
  devtools: {
    enabled: true,
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
  },
  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
  ],
  ssr: true,
  runtimeConfig: {
    public: {},
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
})
