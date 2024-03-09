// https://i18n.nuxtjs.org/docs/getting-started/usage
// https://vue-i18n.intlify.dev/guide/advanced/composition

const messages = {
  en: {
    welcome: "Welcome",
  },
  br: {
    welcome: "Bem-vindo",
  },
};

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages,
}));
