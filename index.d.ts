// More info https://nuxt.com/docs/guide/going-further/runtime-config#typing-runtime-config

import type {
  ComponentCustomOptions as _ComponentCustomOptions,
  ComponentCustomProperties as _ComponentCustomProperties,
} from "vue";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { DepositConfirmPayload, KycPayload, RestrictExpandingPayload, RestrictLicenseAlternativePayload, RestrictLicenseNoAlternativePayload, SettingsPayload } from "./app/types/hooks";

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
    "frontend:command:modal:close": () => HookResult;

    "frontend:command:modal:promo:open": () => HookResult;
    "frontend:command:modal:promo:close": () => HookResult;
    "frontend:event:modal:promo:opened": () => HookResult;
    "frontend:event:modal:promo:closed": () => HookResult;

    "frontend:command:modal:login:open": () => HookResult;
    "frontend:command:modal:login:close": () => HookResult;
    "frontend:event:modal:login:opened": () => HookResult;
    "frontend:event:modal:login:closed": () => HookResult;

    "frontend:command:modal:register:open": () => HookResult;
    "frontend:command:modal:register:close": () => HookResult;
    "frontend:event:modal:register:opened": () => HookResult;
    "frontend:event:modal:register:closed": () => HookResult;

    "frontend:command:modal:deposit:open": () => HookResult;
    "frontend:command:modal:deposit:close": () => HookResult;
    "frontend:event:modal:deposit:opened": () => HookResult;
    "frontend:event:modal:deposit:closed": () => HookResult;

    "frontend:command:modal:deposit-confirm:open": (data: DepositConfirmPayload) => HookResult;
    "frontend:command:modal:deposit-confirm:close": () => HookResult;
    "frontend:event:modal:deposit-confirm:opened": () => HookResult;
    "frontend:event:modal:deposit-confirm:closed": () => HookResult;

    "frontend:command:modal:withdraw:open": () => HookResult;
    "frontend:command:modal:withdraw:close": () => HookResult;
    "frontend:event:modal:withdraw:opened": () => HookResult;
    "frontend:event:modal:withdraw:closed": () => HookResult;

    "frontend:command:modal:forgot-password:open": () => HookResult;
    "frontend:command:modal:forgot-password:close": () => HookResult;
    "frontend:event:modal:forgot-password:opened": () => HookResult;
    "frontend:event:modal:forgot-password:closed": () => HookResult;

    "frontend:command:modal:recover-password:open": () => HookResult;
    "frontend:command:modal:recover-password:close": () => HookResult;
    "frontend:event:modal:recover-password:opened": () => HookResult;
    "frontend:event:modal:recover-password:closed": () => HookResult;

    "frontend:command:modal:search:open": () => HookResult;
    "frontend:command:modal:search:close": () => HookResult;
    "frontend:event:modal:search:opened": () => HookResult;
    "frontend:event:modal:search:closed": () => HookResult;

    "frontend:command:modal:settings:open": (data: SettingsPayload) => HookResult;
    "frontend:command:modal:settings:close": () => HookResult;
    "frontend:event:modal:settings:opened": () => HookResult;
    "frontend:event:modal:settings:closed": () => HookResult;

    "frontend:command:modal:kyc:open": (data: KycPayload) => HookResult;
    "frontend:command:modal:kyc:close": () => HookResult;
    "frontend:event:modal:kyc:opened": () => HookResult;
    "frontend:event:modal:kyc:closed": () => HookResult;

    "frontend:command:modal:close-account:open": () => HookResult;
    "frontend:command:modal:close-account:close": () => HookResult;
    "frontend:event:modal:close-account:opened": () => HookResult;
    "frontend:event:modal:close-account:closed": () => HookResult;

    "frontend:command:modal:restrict-expanding:open": (data: RestrictExpandingPayload) => HookResult;
    "frontend:command:modal:restrict-expanding:close": () => HookResult;
    "frontend:event:modal:restrict-expanding:opened": () => HookResult;
    "frontend:event:modal:restrict-expanding:closed": () => HookResult;

    "frontend:command:modal:restrict-license-alternative:open": (data: RestrictLicenseAlternativePayload) => HookResult;
    "frontend:command:modal:restrict-license-alternative:close": () => HookResult;
    "frontend:event:modal:restrict-license-alternative:opened": () => HookResult;
    "frontend:event:modal:restrict-license-alternative:closed": () => HookResult;

    "frontend:command:modal:restrict-license-no-alternative:open": (data: RestrictLicenseNoAlternativePayload) => HookResult;
    "frontend:command:modal:restrict-license-no-alternative:close": () => HookResult;
    "frontend:event:modal:restrict-license-no-alternative:opened": () => HookResult;
    "frontend:event:modal:restrict-license-no-alternative:closed": () => HookResult;

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

    "frontend:event:signup-flow:submitted": () => HookResult;

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
    "backend:event:payment:status-updated": (data:
    Extract<
      Extract<
        components["schemas"]["WebsocketServerEvent"],
        { type: "notification" }
      >["data"],
      { type: "payment_status_update" }
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
