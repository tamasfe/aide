// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
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
})
