import type { GameRatingsRepositoryI } from "../domain/GameRatingsRepository";
import { ErrorGameRatingNotFound } from "../domain/ErrorGameRatingNotFound";
import type { GameRating, GameRate } from "../domain/GameRating";
import { destructureGameIdentifier } from "../domain/Game";
import { fail, success, type EmptyResult, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class GameRatingsRepositoryGirobet implements GameRatingsRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
  }

  public async rate(gameIdentifier: string, rating: GameRate | null): Promise<EmptyResult<ErrorGameRatingNotFound | InfrastructureError>> {
    try {
      const { gameSlug, providerSlug } = destructureGameIdentifier(gameIdentifier);
      const { data, error, response } = await this.apiClient.POST("/game/{provider_slug}/{game_slug}/rating", {
        params: {
          path: {
            provider_slug: providerSlug,
            game_slug: gameSlug,
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

  public async findById(gameIdentifier: string): Promise<Result<GameRating, ErrorGameRatingNotFound | InfrastructureError>> {
    try {
      const { gameSlug, providerSlug } = destructureGameIdentifier(gameIdentifier);
      const { data, error, response } = await this.apiClient.GET("/game/{provider_slug}/{game_slug}/ratings", {
        params: {
          path: {
            provider_slug: providerSlug,
            game_slug: gameSlug,
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

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
