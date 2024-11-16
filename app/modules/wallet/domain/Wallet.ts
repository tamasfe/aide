import type { WalletCurrency } from "./WalletCurrency";

export interface WalletI {
  id: number;
  balance: string;
  balanceValue: number;
  currency: WalletCurrency;
}

export const newEmptyWallet = (): WalletI => ({
  id: 0,
  balance: "0",
  balanceValue: 0,
  currency: "BRL",
});
