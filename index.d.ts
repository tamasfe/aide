// More info https://nuxt.com/docs/guide/going-further/runtime-config#typing-runtime-config

import type {
  ComponentCustomOptions as _ComponentCustomOptions,
  ComponentCustomProperties as _ComponentCustomProperties,
} from "vue";

declare module "@nuxt/schema" {
  interface PublicRuntimeConfig {
    apiBaseUrlClient: string;
    apiBaseUrlServer: string;
    genericFixedUserJurisdiction: string | undefined;
    errorCapturingEnabled: boolean;
    release: string;
    log: {
      level: "debug" | "info" | "warn" | "error";
    };
    serviceName: string;

    apiMode: "dumb" | "api";
    games: {
      apiMode: "dumb" | "api";
    };
    signupFlows: {
      idsClientRepo: "mock" | "local_storage";
      apiMode: "dumb" | "api";
    };
    users: {
      apiMode: "dumb" | "api";
    };
    sites: {
      apiMode: "dumb" | "api";
    };
    wallets: {
      apiMode: "dumb" | "api";
    };
    providers: {
      apiMode: "dumb" | "api";
    };
    kyc: {
      apiMode: "dumb" | "api";
    };
    tracking: {
      apiMode: "dumb" | "api";
      fingerprintJsPublicApiKey: string | undefined;
      fingerprintJsScriptUrl: string | undefined;
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

declare global {
  interface Window {
    // Anjouan license script loads the following in the window object. More info in the Anjouan vue component:
    anj_baee18f7_63ae_4aa0_b5d7_8160149e921b?: {
      init: () => void;
    };
    _mfq?: any[]; // Mouseflow
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
