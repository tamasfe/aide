// More info @https://nuxt.com/docs/guide/going-further/runtime-config#typing-runtime-config

declare module "nuxt/schema" {
  // interface RuntimeConfig {
  //   apiSecret: string;
  // }
  interface PublicRuntimeConfig {
    apiBaseUrl: string;
    games: {
      apiBaseUrl: string | undefined;
    };
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
