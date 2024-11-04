import type { WalletCurrency } from "./WalletCurrency";

export interface WalletI {
  balance: string;
  balanceValue: number;
  currency: WalletCurrency;
}

export const newEmptyWallet = (): WalletI => ({
  balance: "0",
  balanceValue: 0,
  currency: "BRL",
});
