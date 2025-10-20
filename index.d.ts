// More info https://nuxt.com/docs/guide/going-further/runtime-config#typing-runtime-config

import type {
  ComponentCustomOptions as _ComponentCustomOptions,
  ComponentCustomProperties as _ComponentCustomProperties,
} from "vue";

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
    anj_950afe10_5e7e_4fa8_9bef_21380e8558b3?: {
      init: () => void;
    };
  }
}

declare module "#app" {
  interface RuntimeNuxtHooks {
    // Live Chat
    "frontend:command:live-chat:open": () => HookResult;
    "frontend:event:live-chat:opened": () => HookResult;
    "frontend:command:live-chat:close": () => HookResult;
    "frontend:event:live-chat:closed": () => HookResult;
    "frontend:event:live-chat:ready": () => HookResult;

    // Modals

    // @deprecated
    "frontend:command:modal:open": (modal: UserInteractionModalState) => HookResult;

    "frontend:command:modal:close": () => HookResult;
    "frontend:command:modal:promo:open": () => HookResult;
    "frontend:command:modal:promo:close": () => HookResult;

    // User
    "frontend:event:user:logged-in": () => HookResult;
    "frontend:event:user:logged-out": () => HookResult;
    "frontend:event:user:account-closed": () => HookResult;
    "frontend:event:user:password-recovered": () => HookResult;
    "frontend:event:user:settings-updated": (data: {
      settings: {
        locale?: SupportedLocale;
        password: boolean;
        username?: string;
        consents?: {
          email?: boolean | null;
          postMail?: boolean | null;
          pushNotification?: boolean | null;
          siteNotification?: boolean | null;
          sms?: boolean | null;
          telephone?: boolean | null;
        };
        payment?: {
          keyType: "CPF" | "EMAIL" | "PHONE" | "EVP" | null;
          keyEmail: string | null;
          keyEvp: string | null;
          keyPhone: string | null;
        };
      };
    }) => HookResult;

    "frontend:event:signup-flow:submitted": (data: {
      id: string;
    }) => HookResult;

    "frontend:event:game-session:started": () => HookResult;
    "frontend:event:game-session:finished": () => HookResult;

    "frontend:event:payment:deposit:created": (data: {
      paymentMethodId: number;
      flowId: number;
      code: string;
      amount: number;
      currency: WalletCurrency;
      totalDeposits: number;
    }) => HookResult;

    "frontend:event:payment:withdrawal:created": (data: {
      flowId: number;
      amount: number;
      currency: WalletCurrency;
      totalWithdrawals: number;
    }) => HookResult;

    "frontend:event:websocket:state-changed": (data: {
      state: "connected" | "disconnected";
    }) => HookResult;

    /**
       * Events coming from the Backend
       */
    "backend:event:payment:status-updated": (data: CamelizeKeys<
      Extract<
        components["schemas"]["WebsocketServerEvent"]["data"],
        { type: "payment_status_update" }
      >
    >) => HookResult;

    "backend:event:tracker:payment-updated": (data: CamelizeKeys<
      Extract<
        components["schemas"]["TrackerType"],
        { event: "payment_update" }
      >["event_data"]
    >) => HookResult;

    "backend:event:kyc:completed": (data: {
      notificationId: number;
    }) => HookResult;

    "backend:event:wallet:balance-updated": (data: CamelizeKeys<
      Extract<
        components["schemas"]["WebsocketServerEvent"],
        { type: "balance_update" }
      >["data"]
    >) => HookResult;

    "backend:event:notification:received": (data: {
      notification: NotificationBackend;
    }) => HookResult;
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
