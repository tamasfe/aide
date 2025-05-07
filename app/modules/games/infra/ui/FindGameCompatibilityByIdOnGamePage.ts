import type { FindGameCompatibilityByIdentifier, FindGameCompatibilityByIdResponseI } from "../../application/FindGameCompatibilityById";
import { ErrorGameNotFound } from "../../domain/ErrorGameNotFound";
import type { LoggerI } from "~/packages/logger/Logger";

export class FindGameCompatibilityByIdentifierOnGamePage {
  constructor(private query: FindGameCompatibilityByIdentifier, private logger: LoggerI) {}

  public async handle(gameIdentifier: string, userDevice: "mobile" | "desktop"): Promise<FindGameCompatibilityByIdResponseI | null> {
    const gameResult = await this.query.handle(gameIdentifier, userDevice);
    if (gameResult.isFailure) {
      if (gameResult.error instanceof ErrorGameNotFound) {
        this.logger.warn("Game not found by its id in the game/:game_id page", { gameIdentifier });
        return null;
      }

      this.logger.error("Unexpected error while trying to find a game by its id in the game/:game_id page", gameResult.error, { gameIdentifier, userDevice });
      return null;
    }

    return gameResult.value;
  }
}
