import type { WalletRepositoryI } from "../domain/WalletRepository";
import { success } from "~/packages/result";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

export class WalletsRepositoryDumb implements WalletRepositoryI {
  public async findAuthenticated() {
    return success([{
      walletId: 1,
      balance: 123.05,
      currency: "EUR" as WalletCurrency,
    }]);
  }
}
