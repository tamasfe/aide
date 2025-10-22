import type { WalletCurrency } from "../modules/wallet/domain/WalletCurrency";
import type { components } from "../packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export type DepositConfirmPayload = {
  flowId: number;
  paymentCode: string;
  amount: number;
  currency: WalletCurrency;
  paymentMethodId: number;
};

export type RecoverPasswordPayload = {
  token: string;
};

export type SettingsPayload = "password"
  | "language"
  | "time_zone"
  | "payment_pix"
  | "username";

export type KycPayload = {
  provider: components["schemas"]["IntegrationIdentifier"];
  accessToken: string;
  applicantData: {
    email: string;
    phone: string;
    language: string;
  };
};

export type RestrictLicenseAlternativePayload = {
  jurisdiction: string;
  currentHost: string;
  blockedCountry: string;
  allowedUrl: string;
};

export type RestrictLicenseNoAlternativePayload = {
  jurisdiction: string;
  currentHost: string;
  blockedCountry: string;
};

export type RestrictExpandingPayload = {
  jurisdiction: string;
  currentHost: string;
  blockedCountry: string;
};
