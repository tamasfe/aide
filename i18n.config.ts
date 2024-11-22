// https://vue-i18n.intlify.dev/guide/essentials/started.html

export default defineI18nConfig(() => ({
  locale: "en-US",
  legacy: false,
  numberFormats: {
    "en-US": {
      currency: {
        style: "currency", currency: "USD", notation: "standard",
      },
    },
    "pt-BR": {
      currency: {
        style: "currency", currency: "BRL", notation: "standard",
      },
    },
  },
  fallbackLocale: {
    pt: ["pt-BR"],
    en: ["en-US"],
    "pt-BR": ["en-US"],
  },
}));
