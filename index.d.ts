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
    "frontend:commands:modals:open-live-chat": () => HookResult;
    "frontend:commands:modals:live-chat-opened": () => HookResult;
    "frontend:commands:modals:close-live-chat": () => HookResult;
    "frontend:commands:modals:live-chat-closed": () => HookResult;
    "frontend:commands:modals:live-chat-is-ready": () => HookResult;

    "frontend:commands:modals:open-user-interaction-modal": (modal: UserInteractionModalState) => HookResult;
    "frontend:commands:modals:close-user-interaction-modal": () => HookResult;

    "frontend:events:users:user-logged-in": () => HookResult;
    "frontend:events:users:user-logged-out": () => HookResult;
    "frontend:events:users:user-closed-account": () => HookResult;
    "frontend:events:users:password-recovered": () => HookResult;
    "frontend:events:users:user-settings-updated": (data: {
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

    "frontend:events:signup-flows:signup-flow-submitted": (data: {
      id: string;
    }) => HookResult;

    "frontend:events:games:game-session-started": () => HookResult;
    "frontend:events:games:game-session-finished": () => HookResult;

    "frontend:events:payments:deposit-flow-created": (data: {
      paymentMethodId: number;
      flowId: number;
      code: string;
      amount: number;
      currency: WalletCurrency;
      totalDeposits: number;
    }) => HookResult;

    "frontend:events:payments:withdrawal-flow-created": (data: {
      flowId: number;
      amount: number;
      currency: WalletCurrency;
      totalWithdrawals: number;
    }) => HookResult;

    "frontend:events:websockets:connection-state-changed": (data: {
      state: "connected" | "disconnected";
    }) => HookResult;

    /**
       * Events coming from the Backend
       */
    "backend:events:payments:payment-status-updated": (data: CamelizeKeys<
      Extract<
        components["schemas"]["WebsocketServerEvent"]["data"],
        { type: "payment_status_update" }
      >
    >) => HookResult;

    "backend:events:tracker:payment-updated": (data: CamelizeKeys<
      Extract<
        components["schemas"]["TrackerType"],
        { event: "payment_update" }
      >["event_data"]
    >) => HookResult;

    "backend:events:kyc:kyc-process-completed": (data: {
      notificationId: number;
    }) => HookResult;

    "backend:events:wallets:wallet-balance-updated": (data: CamelizeKeys<
      Extract<
        components["schemas"]["WebsocketServerEvent"],
        { type: "balance_update" }
      >["data"]
    >) => HookResult;

    "backend:events:backend-notification-received": (data: {
      notification: NotificationBackend;
    }) => HookResult;
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
