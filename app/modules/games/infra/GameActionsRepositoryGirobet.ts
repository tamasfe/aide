import type { GameActionsRepositoryI } from "../domain/GameActionsRepository";
import type { GameActionI } from "../domain/GameAction";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class GameActionsRepositoryGirobet implements GameActionsRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
  }

  public async searchPaginating(searchParams: { type: "bet" | "win" | null }, limit: number, offset: number): Promise<Result<{ gameActions: GameActionI[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/game/action/list", {
        params: {
          query: {
            action_type: searchParams.type,
            limit,
            offset,
          },
        },
      });

      if (data) {
        return success({
          gameActions: data.data.map(gameActionData => ({
            id: gameActionData.id,
            action: gameActionData.action,
            amount: gameActionData.amount,
            currency: gameActionData.currency,
            createdAt: new Date(gameActionData.created_at),
            game: {
              id: gameActionData.game_id,
              name: gameActionData.game_name,
            },
          })),
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

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
