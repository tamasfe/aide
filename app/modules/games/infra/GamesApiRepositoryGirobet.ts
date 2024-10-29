import type { GameI, GameSummaryI } from "../domain/Game";
import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import { ErrorGameNotFound } from "../domain/ErrorGameNotFound";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class GamesApiRepositoryGirobet implements GamesApiRepositoryI {
  constructor(clientOptions: { baseUrl: string; headers?: Record<string, string>; userJurisdiction?: string }, asyncMessagePublisher: AsyncMessagePublisherI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, asyncMessagePublisher);
  }

  public async searchPaginating(searchParams: { category: string | null; query: string | null }, limit: number, offset: number): Promise<Result<{ games: GameSummaryI[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/game/search", {
        params: {
          query: {
            category: searchParams.category,
            query: searchParams.query,
            limit,
            offset,
          },
        },
      });

      if (data) {
        return success({
          games: data.data,
          pagination: {
            limit: data.metadata.pagination.limit,
            offset: data.metadata.pagination.offset,
            totalItems: data.metadata.pagination.total_items,
          },
        });
      }

      if (error) {
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

  public async findById(gameId: number): Promise<Result<GameI, ErrorGameNotFound | InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/game/{game_id}", {
        params: {
          path: {
            game_id: gameId,
          },
        },
      });

      if (data) {
        return success({
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          devices: data.devices,
        });
      }

      if (error) {
        if (error.code === "GAME_NOT_FOUND") {
          return fail(
            ErrorGameNotFound.newFromGameId(gameId),
          );
        }
        return fail(
          InfrastructureError.newFromError({
            gameId,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({
          gameId,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          gameId,
        }, error),
      );
    }
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
