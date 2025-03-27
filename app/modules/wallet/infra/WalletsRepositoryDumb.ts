import type { WalletRepositoryI } from "../domain/WalletRepository";
import { success } from "~/packages/result";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

export class WalletsRepositoryDumb implements WalletRepositoryI {
  public async findAuthenticated() {
    return success([{
      walletId: 1,
      balanceUnlocked: 120.05,
      balanceLocked: 3,
      balanceBonus: 99,
      currency: "EUR" as WalletCurrency,
    }]);
  }
}
