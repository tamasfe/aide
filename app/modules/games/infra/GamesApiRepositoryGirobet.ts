import { destructureGameIdentifier, type Game, type GameSearchResponse } from "../domain/Game";
import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import { ErrorGameNotFound } from "../domain/ErrorGameNotFound";
import { ErrorSearchIndexNotFound } from "../domain/ErrorSearchIndexNotFound";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class GamesApiRepositoryGirobet implements GamesApiRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
  }

  public async searchPaginating(searchParams: { category: string | null; query: string | null; providerIdentifier: string | null }, limit: number, offset: number): Promise<Result<{ games: GameSearchResponse[]; pagination: { limit: number; offset: number; totalItems: number } }, ErrorSearchIndexNotFound | InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/game/search", {
        params: {
          query: {
            category: searchParams.category,
            query: searchParams.query,
            provider_identifier: searchParams.providerIdentifier,
            limit,
            offset,
          },
        },
      });

      if (data) {
        return success({
          games: data.data.map(game => camelizeKeys({ ...game })),
          pagination: {
            limit: data.metadata.pagination.limit,
            offset: data.metadata.pagination.offset,
            totalItems: data.metadata.pagination.total_items,
          },
        });
      }

      if (error) {
        if (error.code === "SEARCH_INDEX_NOT_FOUND") {
          return fail(
            ErrorSearchIndexNotFound.new({ searchParams }),
          );
        }

        return fail(
          InfrastructureError.newFromError({
            searchParams, limit, offset,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({
          searchParams, limit, offset,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          searchParams, limit, offset,
        }, error),
      );
    }
  }

  public async findByIdentifier(gameIdentifier: string): Promise<Result<Game, ErrorGameNotFound | InfrastructureError>> {
    try {
      const { gameSlug, providerSlug } = destructureGameIdentifier(gameIdentifier);
      const { data, error, response } = await this.apiClient.GET("/game/{provider_slug}/{game_slug}", {
        params: {
          path: {
            game_slug: gameSlug,
            provider_slug: providerSlug,
          },
        },
      });

      if (data) {
        return success(camelizeKeys({ ...data }));
      }

      if (error) {
        if (error.code === "GAME_NOT_FOUND") {
          return fail(
            ErrorGameNotFound.newFromGameIdentifier(gameIdentifier),
          );
        }
        return fail(
          InfrastructureError.newFromError({
            gameIdentifier,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({
          gameIdentifier,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          gameIdentifier,
        }, error),
      );
    }
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
