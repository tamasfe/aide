import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export const newEmptyWallet = (): components["schemas"]["UserWalletBalanceResponse"] => ({
  wallet_id: 0,
  balance: 0,
  currency: "BRL",
});
