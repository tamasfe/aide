// https://vue-i18n.intlify.dev/guide/essentials/started.html

export default defineI18nConfig(() => ({
  locale: "en",
  legacy: false,
  numberFormats: {
    en: {
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
}));
