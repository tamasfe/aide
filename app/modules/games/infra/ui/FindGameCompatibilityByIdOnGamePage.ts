import type { FindGameCompatibilityById, FindGameCompatibilityByIdResponseI } from "../../application/FindGameCompatibilityById";
import { ErrorGameNotFound } from "../../domain/ErrorGameNotFound";
import type { LoggerI } from "~/packages/logger/Logger";

export class FindGameCompatibilityByIdOnGamePage {
  constructor(private query: FindGameCompatibilityById, private logger: LoggerI) {}

  public async handle(gameId: number, userDevice: "mobile" | "desktop"): Promise<FindGameCompatibilityByIdResponseI | null> {
    const gameResult = await this.query.handle(gameId, userDevice);
    if (gameResult.isFailure) {
      if (gameResult.error instanceof ErrorGameNotFound) {
        this.logger.warn("Game not found by its id in the game/:game_id page", { gameId });
        return null;
      }

      this.logger.error("Unexpected error while trying to find a game by its id in the game/:game_id page", { error: gameResult.error, gameId, userDevice });
      return null;
    }

    return gameResult.value;
  }
}
