import type { GameCategoriesRepositoryI } from "../domain/GameCategoriesRepository";
import { GameCategory } from "../domain/GameCategory";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-backend-api-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class GameCategoriesRepositoryGirobet implements GameCategoriesRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
  }

  public async searchByGroup(categoryGroup: string, includeGames: boolean): Promise<Result<GameCategory[], InfrastructureError>> {
    const { data, error, response } = await this.apiClient.GET("/game/category/list", {
      params: {
        query: {
          group: categoryGroup as "home" | "game_page" | "inventory" | null | undefined,
          include_games: includeGames,
        },
      },
    });

    if (data) {
      return success(data.map(category => GameCategory.new({
        id: category.id,
        identifier: category.identifier,
        games: category.games
          ? category.games.data.map(game => camelizeKeys(game))
          : null,
      })));
    }

    if (error) {
      return fail(
        InfrastructureError.newFromError({
          categoryGroup,
        }, HttpBackendApiError.newFromBackendError(error, response)),
      );
    }

    return fail(
      InfrastructureError.newFromUnknownError({
        categoryGroup,
      }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
    );
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
