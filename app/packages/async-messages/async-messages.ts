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
