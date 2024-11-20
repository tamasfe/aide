import type { GameRate, GameRating } from "./GameRating";
import type { ErrorGameRatingNotFound } from "./ErrorGameRatingNotFound";
import type { EmptyResult, Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface GameRatingsRepositoryI {
  findById(gameId: number): Promise<Result<GameRating, ErrorGameRatingNotFound | InfrastructureError>>;
  rate(gameId: number, rating: GameRate | null): Promise<EmptyResult<ErrorGameRatingNotFound | InfrastructureError>>;
}
