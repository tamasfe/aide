// More info @https://nuxt.com/docs/guide/going-further/runtime-config#typing-runtime-config

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
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
