import type { WalletRepositoryI } from "../domain/WalletRepository";
import type { ErrorNoAuthenticatedWalletsFound } from "../domain/ErrorNoAuthenticatedWalletsFound";
import type { WalletI } from "../domain/Wallet";
import type { WalletCurrency } from "../domain/WalletCurrency";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class WalletsRepositoryDumb implements WalletRepositoryI {
  public async findAuthenticated(): Promise<Result<WalletI[], InfrastructureError | ErrorNoAuthenticatedWalletsFound>> {
    return success([{
      id: 1,
      balance: 123.05,
      currency: "EUR" as WalletCurrency,
    }]);
  }
}
