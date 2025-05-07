import type { GameRate, GameRating } from "./GameRating";
import type { ErrorGameRatingNotFound } from "./ErrorGameRatingNotFound";
import type { EmptyResult, Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface GameRatingsRepositoryI {
  findById(gameIdentifier: string): Promise<Result<GameRating, ErrorGameRatingNotFound | InfrastructureError>>;
  rate(gameIdentifier: string, rating: GameRate | null): Promise<EmptyResult<ErrorGameRatingNotFound | InfrastructureError>>;
}
