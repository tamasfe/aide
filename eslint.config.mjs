// https://eslint.nuxt.com/packages/module

import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  ignores: [
    "app/packages/http-client/girobet-backend-generated-http-client/openapi-typescript.d.ts",
  ],
}).override("nuxt/vue/rules", {
  rules: {
    "vue/singleline-html-element-content-newline": "off",
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: {
          max: 3,
        },
        multiline: {
          max: 1,
        },
      },
    ],
  },
});
