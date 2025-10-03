import type { LoggerI } from "~/packages/logger/Logger";
import { GameIdentifier } from "../../domain/Game";
import type { GameSessionsRepositoryI } from "../../domain/GameSessionsRepository";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

type Response = {
  isFailure: false;
  value: {
    url: string;
  };
} | {
  isFailure: true;
  errorName: "ErrorInvalidGameIdentifier" | "InfrastructureError" | "ErrorInsufficientFunds" | "ErrorUnauthorized" | "ErrorGameNotFound" | "ErrorWalletNotFound" | "ErrorGameNotAccessible";
};

export class CreateGameSessionFromGamePage {
  constructor(
    private readonly gameSessionsRepository: GameSessionsRepositoryI,
    private readonly logger: LoggerI,
  ) {}

  public async handle(gameIdentifierValue: string, userId: number | undefined, currency: WalletCurrency | undefined, clientType: "desktop" | "mobile"): Promise<Response> {
    const gameIdentifierResult = GameIdentifier.newFromString(gameIdentifierValue);
    if (gameIdentifierResult.isFailure) {
      return {
        isFailure: true,
        errorName: "ErrorInvalidGameIdentifier",
      };
    }

    if (!userId) {
      return {
        isFailure: true,
        errorName: "ErrorUnauthorized",
      };
    }

    if (!currency) {
      return {
        isFailure: true,
        errorName: "ErrorWalletNotFound",
      };
    }

    const resultCreatingSession = await this.gameSessionsRepository.create(gameIdentifierResult.value, currency, clientType);
    if (resultCreatingSession.isFailure) {
      if (resultCreatingSession.error.name === "InfrastructureError") {
        this.logger.error("Unexpected error creating game session", resultCreatingSession.error, {
          userId,
          gameIdentifier: gameIdentifierValue,
          currency,
          clientType,
        });
      }
      return {
        isFailure: true,
        errorName: resultCreatingSession.error.name,
      };
    }

    return {
      isFailure: false,
      value: {
        url: resultCreatingSession.value.url,
      },
    };
  }
}
