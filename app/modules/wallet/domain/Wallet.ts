import type { WalletCurrency } from "./WalletCurrency";

export interface WalletI {
  id: number;
  balance: number;
  currency: WalletCurrency;
}

export const newEmptyWallet = (): WalletI => ({
  id: 0,
  balance: 0,
  currency: "BRL",
});
