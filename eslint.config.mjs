// https://eslint.nuxt.com/packages/module

import withNuxt from ".nuxt/eslint.config.mjs";

export default withNuxt(
  // custom config
).override("nuxt/vue/rules", {
  rules: {
    "vue/singleline-html-element-content-newline": "off",
  },
});
