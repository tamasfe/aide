import type { GameActionsRepositoryI } from "../domain/GameActionsRepository";
import type { GameAction } from "../domain/GameAction";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { HttpBackendApiError } from "~/packages/http-client/http-backend-api-error";
import type { ApiClient } from "../../../plugins/api-client";

export class GameActionsRepositoryGirobet implements GameActionsRepositoryI {
  constructor(private readonly apiClient: ApiClient) {}

  public async searchPaginating(searchParams: { type: "bet" | "win" | null }, limit: number, offset: number): Promise<Result<{ gameActions: GameAction[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
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
          gameActions: data.data.map(gameAction => camelizeKeys(gameAction)),
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
}
