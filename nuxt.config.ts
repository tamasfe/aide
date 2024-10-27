// https://nuxt.com/docs/api/nuxt-config
// This is the config
export default defineNuxtConfig({
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
    "nuxt-gtag",
  ],
  ssr: true,
  devtools: {
    enabled: true,
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no, shrink-to-fit=no",
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
    rootId: "app",
  },
  site: {
    url: "https://girobet.vip",
    name: "GiroBet",
    // description: "Welcome to my awesome site!", // TODO
    // defaultLocale: "en", // TODO not needed if you have @nuxtjs/i18n installed
  },
  // More info about runtime config & environment variables @ https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      genericFixedUserJurisdiction: process.env.NUXT_PUBLIC_GENERIC_API_CLIENT_FIXED_USER_JURISDICTION,
      games: {
        apiBaseUrl: process.env.NUXT_PUBLIC_GAMES_API_BASE_URL,
      },
      signupFlows: {
        idsClientRepo: process.env.NUXT_PUBLIC_SIGNUP_FLOWS_IDS_CLIENT_REPO as
        | "mock"
        | "local_storage",
        apiBaseUrl: process.env.NUXT_PUBLIC_SIGNUP_FLOWS_API_CLIENT_BASE_URL || "",
        apiClientFixedUserJurisdiction: process.env.NUXT_PUBLIC_SIGNUP_FLOWS_API_CLIENT_FIXED_USER_JURISDICTION || "",
      },
      users: {
        authenticatedRepositoryBaseUrl: process.env.NUXT_PUBLIC_USERS_AUTHENTICATED_REPO_BASE_URL || "",
      },
      wallets: {
        apiBaseUrl: process.env.NUXT_PUBLIC_WALLETS_API_BASE_URL || "",
      },
    },
  },
  build: {
    transpile: ["applicationinsights"],
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-07-03",
  typescript: {
    strict: true,
    typeCheck: true,
  },
  debug: false,
  // @nuxtjs/eslint
  eslint: {
    ignores: "app/packages/http-client/girobet-backend-generated-http-client/openapi-typescript.d.ts",
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
  // nuxt-gtag
  gtag: {
    id: "G-XXXXXXXXXX",
    enabled: process.env.NODE_ENV === "production",
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
  pinia: {},
});
