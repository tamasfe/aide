import type { WalletRepositoryI } from "../domain/WalletRepository";
import { success } from "~/packages/result";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

export class WalletsRepositoryDumb implements WalletRepositoryI {
  public async findAuthenticated() {
    return success([{
      wallet_id: 1,
      balance_unlocked: 120.05,
      balance_locked: 3,
      balance_bonus: 99,
      currency: "EUR" as WalletCurrency,
    }]);
  }

  public async getAvailableCurrencies() {
    return success(["BRL" as WalletCurrency, "EUR" as WalletCurrency]);
  }
}
