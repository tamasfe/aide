import { ErrorGameRatingNotFound } from "../domain/ErrorGameRatingNotFound";
import { GameRating, type GameRate } from "../domain/GameRating";
import type { GameRatingsRepositoryI } from "../domain/GameRatingsRepository";
import type { LoggerI } from "~/packages/logger/Logger";
import { fail, success, type EmptyResult, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class GameRatingsRepositoryDumb implements GameRatingsRepositoryI {
  public async rate(gameId: number, rating: GameRate | null): Promise<EmptyResult<ErrorGameRatingNotFound | InfrastructureError>> {
    this.logger.debug("rate called", { gameId, rating });
    const gameRatingOrNull = this.gameRatings.get(gameId) ?? null;
    if (gameRatingOrNull === null) {
      this.gameRatings.set(
        gameId,
        GameRating.new({
          id: gameId,
          rating,
          likes: rating === "like" ? 1 : 0,
          dislikes: rating === "dislike" ? 1 : 0,
        }),
      );
      return success();
    }

    return success(gameRatingOrNull);
  }

  public async findById(gameId: number): Promise<Result<GameRating, ErrorGameRatingNotFound | InfrastructureError>> {
    this.logger.debug("findRating called", { gameId });
    const gameRatingOrNull = this.gameRatings.get(gameId) ?? null;
    if (gameRatingOrNull === null) {
      return fail(ErrorGameRatingNotFound.newFromGameId(gameId));
    }
    return success(gameRatingOrNull);
  }

  private gameRatings: Map<number, GameRating> = new Map();
  constructor(private logger: LoggerI) {}
}
