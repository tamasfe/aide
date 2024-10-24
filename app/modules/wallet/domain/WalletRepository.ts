import type { WalletI } from "./Wallet";
import type { ErrorNoAuthenticatedWalletsFound } from "./ErrorNoAuthenticatedWalletsFound";
import type { ErrorCurrencyNotRecognized } from "./ErrorCurrencyNotRecognized";
import type { ErrorInvalidBalance } from "./ErrorInvalidBalance";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface WalletRepositoryI {
  findAuthenticated(): Promise<Result<WalletI[], InfrastructureError | ErrorNoAuthenticatedWalletsFound | ErrorCurrencyNotRecognized | ErrorInvalidBalance>>;
}
