// https://nuxt.com/docs/api/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no, shrink-to-fit=no",
    },
    rootId: "app",
  },
  css: [
    "~/assets/styles/global.css",
  ],
  debug: false,
  devtools: {
    enabled: true,
  },
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "@nuxtjs/seo",
    // "@nuxtjs/storybook",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
  ],
  runtimeConfig: {
    public: {},
  },
  site: {},
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
    vueI18n: "./i18n.config.ts",
  },
  // @nuxtjs/seo
  linkChecker: {
    enabled: false,
  },
  ogImage: {
    enabled: false,
  },
  robots: {
    enabled: false,
  },
  schemaOrg: {
    enabled: false,
  },
  seoExperiments: {
    enabled: false,
  },
  sitemap: {
    enabled: false,
  },
  // @pinia/nuxt
  pinia: {
    storesDirs: ["./store/**"],
  },
});
