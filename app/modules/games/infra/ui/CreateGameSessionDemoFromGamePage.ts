import type { LoggerI } from "~/packages/logger/Logger";
import { GameIdentifier } from "../../domain/Game";
import type { GameSessionsRepositoryI } from "../../domain/GameSessionsRepository";

export type Response = {
  isFailure: false;
  value: {
    url: string;
  };
} | {
  isFailure: true;
  errorName: "ErrorInvalidGameIdentifier" | "InfrastructureError" | "ErrorGameHasNoDemo" | "ErrorGameNotAccessible" | "ErrorGameNotFound";
};

export class CreateGameSessionDemoFromGamePage {
  constructor(
    private readonly gameSessionsRepository: GameSessionsRepositoryI,
    private readonly logger: LoggerI,
  ) {}

  public async handle(gameIdentifierValue: string, language: string, clientType: "desktop" | "mobile"): Promise<Response> {
    const gameIdentifierResult = GameIdentifier.newFromString(gameIdentifierValue);
    if (gameIdentifierResult.isFailure) {
      return {
        isFailure: true,
        errorName: "ErrorInvalidGameIdentifier",
      };
    }

    const resultCreatingSession = await this.gameSessionsRepository.createDemo(gameIdentifierResult.value, clientType, language);
    if (resultCreatingSession.isFailure) {
      if (resultCreatingSession.error.name === "InfrastructureError") {
        this.logger.error("Unexpected error creating game demo session", resultCreatingSession.error, {
          language,
          gameIdentifier: gameIdentifierValue,
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
