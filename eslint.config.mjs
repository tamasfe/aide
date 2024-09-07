// https://eslint.nuxt.com/packages/module

import withNuxt from "./.nuxt/eslint.config.mjs";

// see settings in nuxt.config.js

export default withNuxt().override("nuxt/vue/rules", {
  rules: {
    "vue/singleline-html-element-content-newline": "off",
  },
});
