import type { GameRatingsRepositoryI } from "../../domain/GameRatingsRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class RateGameFromGameFrameVotes {
  constructor(private logger: LoggerI, private gameRatingsRepo: GameRatingsRepositoryI) {}

  public async handle(gameIdentifier: string, rating: "like" | "dislike" | null): Promise<void> {
    // await new Promise(resolve => setTimeout(resolve, 5000)); // await for 5 seconds to simulate a slow network

    const result = await this.gameRatingsRepo.rate(gameIdentifier, rating);
    if (result.isFailure) {
      this.logger.error("Unexpected error while trying to rate a game from the game frame votes", result.error, { gameId: gameIdentifier, rating });
      return;
    }

    return;
  }
}
