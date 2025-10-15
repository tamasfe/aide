import type { GameRating } from "../../domain/GameRating";
import type { GameRatingsRepositoryI } from "../../domain/GameRatingsRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchGameRatingFromGameFrameVotes {
  constructor(private logger: LoggerI, private gameRatingsRepo: GameRatingsRepositoryI) {}

  public async handle(gameIdentifier: string): Promise<GameRating | null> {
    const result = await this.gameRatingsRepo.findById(gameIdentifier);
    if (result.isFailure) {
      if (result.error.name === "ErrorGameRatingNotFound") {
        return null;
      }
      this.logger.error("Unexpected error while trying to rate a game from the game frame votes", result.error, { gameId: gameIdentifier });
      return null;
    }

    return result.value;
  }
}
