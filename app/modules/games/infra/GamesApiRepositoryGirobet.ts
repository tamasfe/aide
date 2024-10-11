import type { GameI } from "../domain/Game";
import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class GamesApiRepositoryGirobet implements GamesApiRepositoryI {
  constructor(clientOptions: { baseUrl: string; headers?: Record<string, string>; userJurisdiction?: string }, asyncMessagePublisher: AsyncMessagePublisherI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, asyncMessagePublisher);
  }

  public async searchByCategoryPaginating(category: string, limit: number, offset: number): Promise<Result<{ games: GameI[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/game/search", {
        params: {
          query: {
            category,
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
            category, limit, offset,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          category, limit, offset,
        }, error),
      );
    }

    throw new Error("Unexpected scenario: library did not return data nor error. This should never happen");
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
