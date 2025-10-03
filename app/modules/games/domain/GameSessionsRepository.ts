import type { Result } from "~/packages/result";
import type { GameIdentifier } from "./Game";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { ErrorInsufficientFunds } from "~/modules/wallet/domain/ErrorInsufficientFunds";
import type { ErrorUnauthorized } from "~/modules/users/domain/errors/ErrorUnauthorized";
import type { ErrorGameNotFound } from "./ErrorGameNotFound";
import type { ErrorWalletNotFound } from "~/modules/wallet/domain/ErrorWalletNotFound";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { ErrorGameNotAccessible } from "./ErrorGameNotAccessible";
import type { ErrorGameHasNoDemo } from "./ErrorGameHasNoDemo";

export interface GameSessionsRepositoryI {
  create(gameIdentifier: GameIdentifier, currency: WalletCurrency, clientType: "desktop" | "mobile"): Promise<
    Result<{ url: string }, InfrastructureError | ErrorInsufficientFunds | ErrorUnauthorized | ErrorGameNotFound | ErrorWalletNotFound | ErrorGameNotAccessible>
  >;

  createDemo(gameIdentifier: GameIdentifier, clientType: "desktop" | "mobile", language: string): Promise<
    Result<{ url: string }, InfrastructureError | ErrorGameHasNoDemo | ErrorGameNotAccessible | ErrorGameNotFound>
  >;
}
