import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { CamelizeKeys } from "~/utils";

export type Wallet = CamelizeKeys<components["schemas"]["UserWalletBalanceResponse"]>;

export const newEmptyWallet = (): Wallet => ({
  walletId: 0,
  balanceBonus: 0,
  balanceLocked: 0,
  balanceUnlocked: 0,
  currency: "BRL",
});
