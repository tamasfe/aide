// https://vue-i18n.intlify.dev/guide/essentials/started.html

export default defineI18nConfig(() => ({
  locale: "en-us",
  legacy: false,
  numberFormats: {
    "en-us": {
      currency: {
        style: "currency", currency: "USD", notation: "standard",
      },
    },
    "pt-br": {
      currency: {
        style: "currency", currency: "BRL", notation: "standard",
      },
    },
  },
  fallbackLocale: {
    pt: ["pt-br"],
    en: ["en-us"],
    "pt-br": ["en-us"],
  },
}));
