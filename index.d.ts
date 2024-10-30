// More info https://nuxt.com/docs/guide/going-further/runtime-config#typing-runtime-config

import type {
  ComponentCustomOptions as _ComponentCustomOptions,
  ComponentCustomProperties as _ComponentCustomProperties,
} from "vue";

declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    apiBaseUrl: string;
    genericFixedUserJurisdiction: string | undefined;
    games: {
      apiBaseUrlClient: string | undefined;
      apiBaseUrlServer: string | undefined;
    };
    signupFlows: {
      idsClientRepo: "mock" | "local_storage";
      apiBaseUrlClient: string | undefined;
      apiBaseUrlServer: string | undefined;
    };
    users: {
      authenticatedRepositoryBaseUrlClient: string | undefined;
      authenticatedRepositoryBaseUrlServer: string | undefined;
    };
    wallets: {
      apiBaseUrlClient: string;
      apiBaseUrlServer: string;
    };
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties extends _ComponentCustomProperties {}
  interface ComponentCustomOptions extends _ComponentCustomOptions {}
}

// It is always important to ensure you import/export something when augmenting a type
export {};
