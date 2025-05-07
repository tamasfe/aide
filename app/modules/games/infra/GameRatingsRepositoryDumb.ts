import { ErrorGameRatingNotFound } from "../domain/ErrorGameRatingNotFound";
import type { GameRating, GameRate } from "../domain/GameRating";
import type { GameRatingsRepositoryI } from "../domain/GameRatingsRepository";
import type { LoggerI } from "~/packages/logger/Logger";
import { fail, success, type EmptyResult, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class GameRatingsRepositoryDumb implements GameRatingsRepositoryI {
  public async rate(gameIdentifier: string, rating: GameRate | null): Promise<EmptyResult<ErrorGameRatingNotFound | InfrastructureError>> {
    this.logger.debug("rate called", { gameIdentifier, rating });
    const gameRatingOrNull = this.gameRatings.get(gameIdentifier) ?? null;
    if (gameRatingOrNull === null) {
      this.gameRatings.set(gameIdentifier,
        {

          ownRating: rating,
          likes: rating === "like" ? 1 : 0,
          dislikes: rating === "dislike" ? 1 : 0,
        });
      return success();
    }

    return success(gameRatingOrNull);
  }

  public async findById(gameIdentifier: string): Promise<Result<GameRating, ErrorGameRatingNotFound | InfrastructureError>> {
    this.logger.debug("findRating called", { gameIdentifier });
    const gameRatingOrNull = this.gameRatings.get(gameIdentifier) ?? null;
    if (gameRatingOrNull === null) {
      return fail(ErrorGameRatingNotFound.newFromGameIdentifier(gameIdentifier));
    }
    return success(gameRatingOrNull);
  }

  private gameRatings: Map<string, GameRating> = new Map();
  constructor(private logger: LoggerI) {}
}
