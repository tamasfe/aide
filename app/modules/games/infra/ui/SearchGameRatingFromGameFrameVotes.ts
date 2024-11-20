import type { GameRatingsRepositoryI } from "../../domain/GameRatingsRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchGameRatingFromGameFrameVotes {
  constructor(private logger: LoggerI, private gameRatingsRepo: GameRatingsRepositoryI) {}

  public async handle(gameId: number) {
    // await new Promise(resolve => setTimeout(resolve, 5000)); // await for 5 seconds to simulate a slow network

    const result = await this.gameRatingsRepo.findById(gameId);
    if (result.isFailure) {
      if (result.error.name === "ErrorGameRatingNotFound") {
        return null;
      }
      this.logger.error("Unexpected error while trying to rate a game from the game frame votes", result.error, { gameId });
      return null;
    }

    return {
      likes: result.value.likes,
      dislikes: result.value.dislikes,
      rating: result.value.rating,
    };
  }
}
