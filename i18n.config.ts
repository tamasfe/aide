// https://i18n.nuxtjs.org/docs/getting-started/usage
// https://vue-i18n.intlify.dev/guide/advanced/composition
import en from '~/assets/locale/en.js'
import pt from '~/assets/locale/pt.js'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages: {
    en,
    pt
  },
}));
