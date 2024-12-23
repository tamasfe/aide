// More info https://nuxt.com/docs/guide/going-further/runtime-config#typing-runtime-config

import type {
  ComponentCustomOptions as _ComponentCustomOptions,
  ComponentCustomProperties as _ComponentCustomProperties,
} from "vue";

declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    apiBaseUrl: string;
    websocketApiBaseUrl: string;
    genericFixedUserJurisdiction: string | undefined;
    errorCapturingEnabled: boolean;
    release: string;
    log: {
      level: "debug" | "info" | "warn" | "error";
    };
    serviceName: string;
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
    providers: {
      apiBaseUrlClient: string;
      apiBaseUrlServer: string;
    };
    kyc: {
      apiBaseUrlClient: string;
      apiBaseUrlServer: string;
    };
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties extends _ComponentCustomProperties {}
  interface ComponentCustomOptions extends _ComponentCustomOptions {}
}

/**
 * Used in DataTable vue component
 */
declare module "@tanstack/vue-table" {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "center" | "right";
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
