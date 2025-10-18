import { destructureGameIdentifier } from "../domain/Game";
import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import { ErrorGameNotFound } from "../domain/ErrorGameNotFound";
import { fail, success } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { HttpBackendApiError } from "~/packages/http-client/http-backend-api-error";
import type { ApiClient } from "../../../plugins/api-client";

export class GamesApiRepositoryGirobet implements GamesApiRepositoryI {
  constructor(private readonly apiClient: ApiClient) {}

  public async searchPaginating(searchParams: { query: string | null }, pagination: { limit: number; offset: number }) {
    try {
      const { data, error, response } = await this.apiClient.GET("/search/games", {
        params: {
          query: {
            query: searchParams.query,
            limit: pagination.limit,
            offset: pagination.offset,
          },
        },
      });

      if (data) {
        return success({
          results: data.data.map(game => camelizeKeys({ ...game })),
          pagination: {
            limit: data.metadata.pagination.limit,
            offset: data.metadata.pagination.offset,
            totalItems: data.metadata.pagination.total_items ?? data.data.length,
          },
        });
      }

      if (error) {
        return fail(
          InfrastructureError.newFromError({
            searchParams, pagination,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({
          searchParams, pagination,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          searchParams, pagination,
        }, error),
      );
    }
  }

  public async listPaginating(searchParams: { category: string | null; providerIdentifier: string | null }, pagination: { limit: number; offset: number }) {
    try {
      const { data, error, response } = await this.apiClient.GET("/game/list", {
        params: {
          query: {
            category: searchParams.category,
            provider_identifier: searchParams.providerIdentifier,
            limit: pagination.limit,
            offset: pagination.offset,
          },
        },
      });

      if (data) {
        return success({
          games: data.data.map(game => camelizeKeys({ ...game })),
          pagination: {
            limit: data.metadata.pagination.limit,
            offset: data.metadata.pagination.offset,
            totalItems: data.metadata.pagination.total_items ?? NaN,
          },
        });
      }

      if (error) {
        return fail(
          InfrastructureError.newFromError({
            searchParams, pagination,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({
          searchParams, pagination,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          searchParams, pagination,
        }, error),
      );
    }
  }

  public async findByIdentifier(gameIdentifier: string) {
    try {
      const result = destructureGameIdentifier(gameIdentifier);
      if (result.isFailure) {
        return result;
      }
      const { data, error, response } = await this.apiClient.GET("/game/{provider_slug}/{game_slug}", {
        params: {
          path: {
            game_slug: result.value.gameSlug,
            provider_slug: result.value.providerSlug,
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
}
