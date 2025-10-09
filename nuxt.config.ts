// https://nuxt.com/docs/api/nuxt-config
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
    "@vite-pwa/nuxt",
    "nuxt-gtag",
    "@nuxt/fonts",
  ],
  devtools: {
    enabled: true,
  },
  app: {
    head: {
      charset: "utf-8",
      viewport:
        "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no, shrink-to-fit=no",
      script: [
        /**
         * Anjouan Licensing Services Inc. logo. Refer to the Anjouan.vue component for more info.
         */
        {
          src: "https://baee18f7-63ae-4aa0-b5d7-8160149e921b.snippet.anjouangaming.org/anj-seal.js",
          defer: true,
        },
        {
          src: "https://950afe10-5e7e-4fa8-9bef-21380e8558b3.snippet.anjcdn.org/anj-seal.js",
          defer: true,
        },
      ],
    },
    rootId: "app",
  },
  css: ["~/assets/css/tailwind.css"],
  site: {
    url: process.env.NUXT_PUBLIC_BASE_URL,
    // description: "Welcome to my awesome site!", // TODO
    // defaultLocale: "en", // TODO not needed if you have @nuxtjs/i18n installed
  },
  // More info about runtime config & environment variables @ https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    public: {
      env: process.env.NODE_ENV as "development" | "production" | "test",
      apiBaseUrlClient: process.env.NUXT_PUBLIC_API_BASE_URL_CLIENT,
      apiBaseUrlServer: process.env.NUXT_PUBLIC_API_BASE_URL_SERVER,
      genericFixedUserJurisdiction:
        process.env.NUXT_PUBLIC_GENERIC_API_CLIENT_FIXED_USER_JURISDICTION,
      errorCapturingEnabled:
        process.env.NUXT_PUBLIC_ERROR_CAPTURING_ENABLED === "true",
      release: process.env.NUXT_PUBLIC_RELEASE || "development",
      log: {
        level: process.env.NUXT_PUBLIC_LOG_LEVEL as
        | "warn"
        | "error"
        | "debug"
        | "info",
      },
      serviceName: process.env.NUXT_PUBLIC_SERVICE_NAME || "frontend",

      apiMode: process.env.NUXT_PUBLIC_API_MODE as "dumb" | "api",
      games: {
        apiMode: process.env.NUXT_PUBLIC_GAMES_API_MODE as "dumb" | "api",
      },
      signupFlows: {
        idsClientRepo: process.env.NUXT_PUBLIC_SIGNUP_FLOWS_IDS_CLIENT_REPO as
        | "mock"
        | "local_storage",
        apiMode: process.env.NUXT_PUBLIC_SIGNUP_FLOWS_API_MODE as
        | "dumb"
        | "api",
      },
      users: {
        apiMode: process.env.NUXT_PUBLIC_USERS_API_MODE as "dumb" | "api",
      },
      sites: {
        apiMode: process.env.NUXT_PUBLIC_SITES_API_MODE as "dumb" | "api",
      },
      wallets: {
        apiMode: process.env.NUXT_PUBLIC_WALLETS_API_MODE as "dumb" | "api",
      },
      providers: {
        apiMode: process.env.NUXT_PUBLIC_PROVIDERS_API_MODE as "dumb" | "api",
      },
      kyc: {
        apiMode: process.env.NUXT_PUBLIC_KYC_API_MODE as "dumb" | "api",
      },
      tracking: {
        apiMode: process.env.NUXT_PUBLIC_TRACKING_API_MODE as "dumb" | "api",
        fingerprintJsPublicApiKey:
          process.env.NUXT_PUBLIC_TRACKING_FINGERPRINT_JS_PUBLIC_API_KEY,
        fingerprintJsScriptUrl:
          process.env.NUXT_PUBLIC_TRACKING_FINGERPRINT_JS_SCRIPT_URL,
      },

      gtm: {
        id: "GTM-MWG96744", // New "Giro" GTM account
        enabled: process.env.NODE_ENV === "production",
        debug: process.env.NODE_ENV !== "production", // Whether or not display console logs debugs (optional)
      },
    },
  },
  build: {
    transpile: ["applicationinsights"],
  },
  sourcemap: { client: "hidden" },
  devServer: {
    port: 3001,
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-07-03",
  nitro: {
    experimental: {
      /**
       * Recommended to reduce the +15min build times we are getting in our GH actions. Mentioned in these issues:
       * - https://github.com/nitrojs/nitro/issues/2367
       * - https://github.com/nuxt/nuxt/issues/31836
       * - https://github.com/nuxt/nuxt/issues/29727
       * When the huge build time in CI issue is resolved, we can remove this configuration.
       */
      legacyExternals: false,
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      include: ["app/packages/http-client/**/*.d.ts"],
    },
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
  fonts: {
    provider: "google",
    defaults: {
      weights: ["100 900"],
      styles: ["normal"],
      subsets: [
        "latin-ext",
        "latin",
      ]
    },
    families: [
      { name: "Montserrat" },
    ],
  },
  // https://nuxt.com/modules/gtag
  gtag: {
    id: "G-7F9NEQ1MND", // New "Giro" GA account
    enabled: process.env.NODE_ENV === "production",
  },
  // @nuxtjs/i18n
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
    locales: [
      {
        language: "en-US",
        code: "en-us",
        files: [
          "en-US.json",
          "en-US.kyc_policy.yml",
          "en-US.responsible_gaming.yml",
          "en-US.terms_and_conditions.yml",
        ],
        isCatchallLocale: true,
      },
      {
        language: "pt-BR",
        code: "pt-br",
        files: [
          "pt-BR.json",
          "pt-BR.kyc_policy.yml",
          "pt-BR.responsible_gaming.yml",
          "pt-BR.terms_and_conditions.yml",
        ],
      },
    ],
    detectBrowserLanguage: {
      fallbackLocale: "en-us",
      redirectOn: "no prefix",
      alwaysRedirect: false,
      useCookie: true,
    },
    strategy: "prefix_and_default",
    defaultLocale: "en-us",
    vueI18n: "./i18n.config.ts",
  },
  // @nuxt/icon
  icon: {
    clientBundle: {
      scan: true,
    },
    customCollections: [
      {
        prefix: "girobet-flags",
        dir: "./app/assets/svg/flags",
      },
    ],
  },
  image: {
    providers: {
      custom_cloudflare: {
        name: "custom_cloudflare",
        provider: "~/providers/multi-site-custom-cloudflare-image-provider.ts",
      },
    },
    // These are the tailwind breakpoints
    screens: {
      xs: 400,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
    presets: {
      slide: {
        provider: "custom_cloudflare",
        modifiers: {
          sizes: "sm:600px md:400px lg:410px",
          format: "webp",
        },
      },
      game: {
        provider: "custom_cloudflare",
        modifiers: {
          format: "webp",
        },
        sizes: "xs:220px sm:200px md:160px lg:145px",
      },
    },
  },
  // @pinia/nuxt
  pinia: {},
  pwa: {
    disable: true,
    client: {
      installPrompt: true,
      registerPlugin: true,
    },
    injectRegister: "script-defer",
    manifest: {
      theme_color: "#131230",
      background_color: "#e1ac3b",
      icons: [
        {
          purpose: "maskable",
          sizes: "512x512",
          src: "/assets/girobet/pwa/icon512_maskable.png",
          type: "image/png",
        },
        {
          purpose: "any",
          sizes: "512x512",
          src: "/assets/girobet/pwa/icon512_rounded.png",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: "/assets/girobet/pwa/screenshots/1.jpg",
          sizes: "1080x1920",
          type: "image/jpeg",
        },
      ],
      orientation: "portrait",
      display: "standalone",
      lang: "en-US",
      name: "GiroBet", // TODO: be able to customise this depending on current site name
      short_name: "GiroBet", // TODO: be able to customise this depending on current site name
      start_url: "https://girobet.vip/redirect",
      scope: "https://girobet.vip", // TODO: be able to customise this depending on current site name
      description:
        "Welcome to The GiroBet Experience the ultimate thrill of online gambling with us. Play slots, poker, blackjack, and more. Win big with our bonuses and promotions.",
      id: "https://girobet.vip", // TODO: be able to customise this depending on current site name
    },
  },
  sentry: {
    autoInjectServerSentry: "top-level-import",
    sourceMapsUploadOptions: {
      enabled:
        process.env.SENTRY_AUTH_TOKEN !== undefined
        && process.env.SENTRY_AUTH_TOKEN !== "",
      org: "girobet",
      project: "girobet-frontend",
      authToken:
        process.env.SENTRY_AUTH_TOKEN || "placeholder_sentry_auth_token",
    },
  },
});
