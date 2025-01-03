import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

export interface GameActionI {
  id: number;
  action: "bet" | "win" | "rollback";
  amount: number;
  currency: WalletCurrency;
  createdAt: Date;
  game: {
    name: string;
    id: number;
  };
}
