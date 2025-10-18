import type { GameRatingsRepositoryI } from "../domain/GameRatingsRepository";
import { ErrorGameRatingNotFound } from "../domain/ErrorGameRatingNotFound";
import type { GameRate } from "../domain/GameRating";
import { destructureGameIdentifier } from "../domain/Game";
import { fail, success } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { HttpBackendApiError } from "~/packages/http-client/http-backend-api-error";
import type { ApiClient } from "../../../plugins/api-client";

export class GameRatingsRepositoryGirobet implements GameRatingsRepositoryI {
  constructor(private readonly apiClient: ApiClient) {}

  public async rate(gameIdentifier: string, rating: GameRate | null) {
    try {
      const result = destructureGameIdentifier(gameIdentifier);
      if (result.isFailure) {
        return result;
      }
      const { data, error, response } = await this.apiClient.POST("/game/{provider_slug}/{game_slug}/rating", {
        params: {
          path: {
            provider_slug: result.value.providerSlug,
            game_slug: result.value.gameSlug,
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
            ErrorGameRatingNotFound.newFromGameIdentifier(gameIdentifier),
          );
        }

        return fail(
          InfrastructureError.newFromError({ gameId: gameIdentifier, rating }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({ gameId: gameIdentifier, rating }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }

    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({ gameId: gameIdentifier, rating }, error),
      );
    }
  }

  public async findById(gameIdentifier: string) {
    try {
      const result = destructureGameIdentifier(gameIdentifier);
      if (result.isFailure) {
        return result;
      }
      const { data, error, response } = await this.apiClient.GET("/game/{provider_slug}/{game_slug}/ratings", {
        params: {
          path: {
            provider_slug: result.value.providerSlug,
            game_slug: result.value.gameSlug,
          },
        },
      });

      if (data) {
        return success(camelizeKeys({ ...data, own_rating: data.own_rating ?? null }));
      }

      if (error) {
        if (error.code === "GAME_NOT_FOUND") {
          return fail(
            ErrorGameRatingNotFound.newFromGameIdentifier(gameIdentifier),
          );
        }

        return fail(
          InfrastructureError.newFromError({ gameId: gameIdentifier }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({ gameId: gameIdentifier }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }

    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({ gameId: gameIdentifier }, error),
      );
    }
  }
}
