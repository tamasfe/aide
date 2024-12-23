import type { GameRatingsRepositoryI } from "../domain/GameRatingsRepository";
import { ErrorGameRatingNotFound } from "../domain/ErrorGameRatingNotFound";
import { GameRating, type GameRate } from "../domain/GameRating";
import { fail, success, type EmptyResult, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class GameRatingsRepositoryGirobet implements GameRatingsRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
  }

  public async rate(gameId: number, rating: GameRate | null): Promise<EmptyResult<ErrorGameRatingNotFound | InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.POST("/game/{game_id}/rating", {
        params: {
          path: {
            game_id: gameId,
          },
        },
        body: {
          rating,
        },
      });

      if (data || response?.ok) {
        return success();
      }

      if (error) {
        if (error.code === "GAME_NOT_FOUND") {
          return fail(
            ErrorGameRatingNotFound.newFromGameId(gameId),
          );
        }

        return fail(
          InfrastructureError.newFromError({ gameId, rating }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({ gameId, rating }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }

    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({ gameId, rating }, error),
      );
    }
  }

  public async findById(gameId: number): Promise<Result<GameRating, ErrorGameRatingNotFound | InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/game/{game_id}/ratings", {
        params: {
          path: {
            game_id: gameId,
          },
        },
      });

      if (data) {
        return success(GameRating.new({
          id: gameId,
          rating: data.own_rating || null,
          likes: data.likes,
          dislikes: data.dislikes,
        }));
      }

      if (error) {
        if (error.code === "GAME_NOT_FOUND") {
          return fail(
            ErrorGameRatingNotFound.newFromGameId(gameId),
          );
        }

        return fail(
          InfrastructureError.newFromError({ gameId }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({ gameId }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }

    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({ gameId }, error),
      );
    }
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
