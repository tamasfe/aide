// More info @https://nuxt.com/docs/guide/going-further/runtime-config#typing-runtime-config
import type {
  ComponentCustomOptions as _ComponentCustomOptions,
  ComponentCustomProperties as _ComponentCustomProperties,
} from "vue";

declare module "nuxt/schema" {
  // interface RuntimeConfig {
  //   apiSecret: string;
  // }
  interface PublicRuntimeConfig {
    apiBaseUrl: string;
    genericFixedUserJurisdiction: string | undefined;
    games: {
      apiBaseUrl: string | undefined;
    };
    signupFlows: {
      idsClientRepo: "mock" | "local_storage";
      apiBaseUrl: string | undefined;
      apiClientFixedUserJurisdiction: string | undefined;
    };
    users: {
      authenticatedRepoBaseUrl: string;
    };
    wallets: {
      apiBaseUrl: string;
    };
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties extends _ComponentCustomProperties {}
  interface ComponentCustomOptions extends _ComponentCustomOptions {}
}

// It is always important to ensure you import/export something when augmenting a type
export {};
