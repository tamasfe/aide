import { config } from "@vue/test-utils";
import { createI18n } from "vue-i18n";

/**
 * File needed to run before tests to fix a bug with i18n "SyntaxError: Need to install with `app.use` function"
 * More info @https://github.com/nuxt/test-utils/issues/566
 */
const i18n = createI18n({
  locale: "en-us",
  missing: (_, key) => key,
});

config.global.plugins.push(i18n);
