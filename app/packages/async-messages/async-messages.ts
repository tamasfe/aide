import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

type NoDataRequiredModal
  = | "login"
    | "register"
    | "search"
    | "forgot_password"
    | "deposit"
    | "withdrawal"
    | "cancel_registration"
    | "close_account"
    | "promo_user_action";

export type UserInteractionModalState
  = | { modal: NoDataRequiredModal }
    | {
      modal: "recover_password";
      data: { token: string };
    }
    | {
      modal: "settings";
      data: {
        setting:
          | "password"
          | "language"
          | "time_zone"
          | "payment_pix"
          | "username";
      };
    }
    | {
      modal: "deposit_confirm";
      data: {
        flowId: number;
        paymentCode: string;
        amount: number;
        currency: WalletCurrency;
        paymentMethodId: number;
      };
    }
    | {
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
    }
    | {
      modal: "restrict_license_alternative";
      data: {
        jurisdiction: string;
        currentHost: string;
        blockedCountry: string;
        allowedUrl: string;
      };
    }
    | {
      modal: "restrict_license_no_alternative";
      data: {
        jurisdiction: string;
        currentHost: string;
        blockedCountry: string;
      };
    }
    | {
      modal: "restrict_expanding";
      data: {
        jurisdiction: string;
        currentHost: string;
        blockedCountry: string;
      };
    };

export interface AsyncMessagesTypes {
  a: undefined;
  // "frontend:command:modal:open": UserInteractionModalState;
  // "frontend:command:modal:close": object;

  // "frontend:command:live-chat:open": object;
  // "frontend:command:live-chat:close": object;
  // "frontend:event:live-chat:ready": object;

  // "frontend:event:user:logged-in": object;
  // "frontend:event:user:logged-out": object;
  // "frontend:event:user:account-closed": object;
  // "frontend:event:user:password-recovered": object;
  // "frontend:event:user:settings-updated": {
  //   settings: {
  //     locale?: SupportedLocale;
  //     password: boolean;
  //     username?: string;
  //     consents?: {
  //       email?: boolean | null;
  //       postMail?: boolean | null;
  //       pushNotification?: boolean | null;
  //       siteNotification?: boolean | null;
  //       sms?: boolean | null;
  //       telephone?: boolean | null;
  //     };
  //     payment?: {
  //       keyType: "CPF" | "EMAIL" | "PHONE" | "EVP" | null;
  //       keyEmail: string | null;
  //       keyEvp: string | null;
  //       keyPhone: string | null;
  //     };
  //   };
  // };

  // "frontend:event:signup-flow:submitted": {
  //   id: string;
  // };

  // "frontend:event:game-session:started": undefined;
  // "frontend:event:game-session:finished": undefined;

  // "frontend:event:payment:deposit:created": {
  //   paymentMethodId: number;
  //   flowId: number;
  //   code: string;
  //   amount: number;
  //   currency: WalletCurrency;
  //   totalDeposits: number;
  // };
  // "frontend:event:payment:withdrawal:created": {
  //   flowId: number;
  //   amount: number;
  //   currency: WalletCurrency;
  //   totalWithdrawals: number;
  // };

  // "frontend:event:websocket:state-changed": {
  //   state: "connected" | "disconnected";
  // };

  // /**
  //  * Events coming from the Backend
  //  */
  // "backend:event:payment:status-updated": CamelizeKeys<
  //   Extract<
  //     components["schemas"]["WebsocketServerEvent"]["data"],
  //     { type: "payment_status_update" }
  //   >
  // >;
  // "backend:event:tracker:payment-updated": CamelizeKeys<
  //   Extract<
  //     components["schemas"]["TrackerType"],
  //     { event: "payment_update" }
  //   >["event_data"]
  // >;
  // "backend:event:kyc:completed": {
  //   notificationId: number;
  // };
  // "backend:event:wallet:balance-updated": CamelizeKeys<
  //   Extract<
  //     components["schemas"]["WebsocketServerEvent"],
  //     { type: "balance_update" }
  //   >["data"]
  // >;
  // "backend:event:notification:received": {
  //   notification: NotificationBackend;
  // };
}
