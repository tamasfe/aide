import type { SupportedLocale } from "../translation";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { NotificationBackend } from "~/modules/notifications/domain/NotificationBackend";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { CamelizeKeys } from "~/utils";

type NoDataRequiredModal = "login" | "register" | "search" | "forgot_password" | "deposit" | "withdrawal" | "cancel_registration" | "close_account";

export type UserInteractionModalState =
  | { modal: NoDataRequiredModal }
  | {
    modal: "recover_password";
    data: { token: string };
  } | {
    modal: "settings";
    data: { setting: "password" | "language" | "time_zone" | "payment_pix" };
  } | {
    modal: "deposit_confirm";
    data: { flowId: number; paymentCode: string; amount: number; currency: WalletCurrency; paymentMethodId: number };
  } |
  {
    modal: "kyc";
    data: {
      provider: components["schemas"]["IntegrationIdentifier"];
      accessToken: string;
      applicantData: {
        email: string;
        phone: string;
        language: string;
      };
    };
  } |
  {
    modal: "restrict_license_alternative";
    data: { jurisdiction: string; currentHost: string; blockedCountry: string; allowedUrl: string };
  } |
  {
    modal: "restrict_license_no_alternative";
    data: { jurisdiction: string; currentHost: string; blockedCountry: string };
  } |
  {
    modal: "restrict_expanding";
    data: { jurisdiction: string; currentHost: string; blockedCountry: string };
  };

export interface AsyncMessagesTypes {
  "girobet:commands:modals:open-user-interaction-modal": UserInteractionModalState;
  "girobet:commands:modals:close-user-interaction-modal": object;

  "girobet:events:users:user-logged-in": object;
  "girobet:events:users:user-logged-out": object;
  "girobet:events:users:user-closed-account": object;
  "girobet:events:users:password-recovered": object;
  "girobet:events:users:user-settings-updated": {
    settings: {
      locale?: SupportedLocale;
      password: boolean;
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
  };

  "girobet:events:signup-flows:signup-flow-submitted": {
    id: string;
  };

  "girobet:events:games:game-session-started": {
    gameId: number;
  };
  "girobet:events:games:game-session-finished": {
    gameId: number;
  };

  "girobet:events:payments:deposit-flow-created": {
    paymentMethodId: number;
    flowId: number;
    code: string;
    amount: number;
    currency: WalletCurrency;
  };
  "girobet:events:payments:withdrawal-flow-created": {
    flowId: number;
  };

  "girobet:events:websockets:connection-state-changed": {
    state: "connected" | "disconnected";
  };

  /**
   * Events coming from the Backend
   */
  "girobet-backend:events:payments:payment-status-updated": CamelizeKeys<Extract<components["schemas"]["WebsocketServerEvent"]["data"], { type: "payment_status_update" }>>;
  "girobet-backend:events:kyc:kyc-process-completed": {
    notificationId: number;
  };
  "girobet-backend:events:wallets:wallet-balance-updated": CamelizeKeys<Extract<components["schemas"]["WebsocketServerEvent"], { type: "balance_update" }>["data"]>;
  "girobet-backend:events:backend-notification-received": {
    notification: NotificationBackend;
  };
}
