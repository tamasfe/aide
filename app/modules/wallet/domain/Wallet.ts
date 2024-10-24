import type { WalletCurrency } from "./WalletCurrency";

export interface WalletI {
  balance: string;
  balanceValue: number;
  currency: WalletCurrency;
}
