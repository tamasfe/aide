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
    "@sentry/nuxt/module",
    "@vee-validate/nuxt",
    "nuxt-gtag",
  ],
  ssr: true,
  devtools: {
    enabled: true,
  },
  devServer: {
    port: 3001,
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
      errorCapturingEnabled: process.env.NUXT_PUBLIC_ERROR_CAPTURING_ENABLED === "true",
      release: process.env.NUXT_PUBLIC_RELEASE || "development",
      log: {
        level: process.env.NUXT_PUBLIC_LOG_LEVEL,
      },
      serviceName: process.env.NUXT_PUBLIC_SERVICE_NAME || "girobet-frontend",
      games: {
        apiBaseUrlClient: process.env.NUXT_PUBLIC_GAMES_API_BASE_URL_CLIENT,
        apiBaseUrlServer: process.env.NUXT_PUBLIC_GAMES_API_BASE_URL_SERVER,
      },
      signupFlows: {
        idsClientRepo: process.env.NUXT_PUBLIC_SIGNUP_FLOWS_IDS_CLIENT_REPO as
        | "mock"
        | "local_storage",
        apiBaseUrlClient: process.env.NUXT_PUBLIC_SIGNUP_FLOWS_API_BASE_URL_CLIENT,
        apiBaseUrlServer: process.env.NUXT_PUBLIC_SIGNUP_FLOWS_API_BASE_URL_SERVER,
      },
      users: {
        authenticatedRepositoryBaseUrlClient: process.env.NUXT_PUBLIC_USERS_AUTHENTICATED_REPOSITORY_BASE_URL_CLIENT,
        authenticatedRepositoryBaseUrlServer: process.env.NUXT_PUBLIC_USERS_AUTHENTICATED_REPOSITORY_BASE_URL_SERVER,
      },
      wallets: {
        apiBaseUrlClient: process.env.NUXT_PUBLIC_WALLETS_API_BASE_URL_CLIENT,
        apiBaseUrlServer: process.env.NUXT_PUBLIC_WALLETS_API_BASE_URL_SERVER,
      },
      providers: {
        apiBaseUrlClient: process.env.NUXT_PUBLIC_PROVIDERS_API_BASE_URL_CLIENT,
        apiBaseUrlServer: process.env.NUXT_PUBLIC_PROVIDERS_API_BASE_URL_SERVER,
      },
    },
  },
  build: {
    transpile: ["applicationinsights"],
  },
  sourcemap: { client: true },
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
  // @nuxt/icon
  icon: {
    clientBundle: {
      scan: true,
    },
  },
  // @pinia/nuxt
  pinia: {},
  sentry: {
    // dynamicImportForServerEntry: true,
    sourceMapsUploadOptions: {
      enabled: process.env.SENTRY_AUTH_TOKEN !== undefined && process.env.SENTRY_AUTH_TOKEN !== "",
      org: "girobet",
      project: "girobet-frontend",
      authToken: process.env.SENTRY_AUTH_TOKEN || "placeholder_sentry_auth_token",
    },
  },
});
