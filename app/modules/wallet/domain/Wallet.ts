import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export const newEmptyWallet = (): CamelizeKeys<components["schemas"]["UserWalletBalanceResponse"]> => ({
  walletId: 0,
  balance: 0,
  currency: "BRL",
});
