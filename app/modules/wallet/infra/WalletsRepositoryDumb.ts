import type { WalletRepositoryI } from "../domain/WalletRepository";
import type { ErrorNoAuthenticatedWalletsFound } from "../domain/ErrorNoAuthenticatedWalletsFound";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export class WalletsRepositoryDumb implements WalletRepositoryI {
  public async findAuthenticated(): Promise<Result<components["schemas"]["UserWalletBalanceResponse"][], InfrastructureError | ErrorNoAuthenticatedWalletsFound>> {
    return success([{
      wallet_id: 1,
      balance: 123.05,
      currency: "EUR" as components["schemas"]["Currency"],
    }]);
  }
}
