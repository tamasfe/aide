import type { SearchGamesPaginating } from "../../application/SearchGamesPaginating";
import { ErrorSearchIndexNotFound } from "../../domain/ErrorSearchIndexNotFound";
import type { SearchGameResultI } from "./SearchGameResult";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchGamesPaginatingOnGrid {
  constructor(
    private query: SearchGamesPaginating,
    private logger: LoggerI,
  ) {

  }

  public static DEFAULT_PAGINATION_SIZE = 25;

  public async handle(categoryIdentifier: string | null, providerId: number | null, pageToSearch: number, pageSize = SearchGamesPaginatingOnGrid.DEFAULT_PAGINATION_SIZE): Promise<{
    games: SearchGameResultI[];
    canLoadMore: boolean;
    totalGames: number;
  }> {
    const result = await this.query.handle(categoryIdentifier, null, providerId, pageToSearch, pageSize);

    if (result.isFailure) {
      if (result.error instanceof ErrorSearchIndexNotFound) {
        this.logger.warn("The search index was not found", { error: result.error });
        return {
          games: [],
          canLoadMore: false,
          totalGames: 0,
        };
      }

      // Optional TODO: alert the customer somehow in case of error
      this.logger.error("SearchGamesPaginatingOnGrid failed", result.error);
      return {
        games: [],
        canLoadMore: false,
        totalGames: 0,
      };
    }

    const canLoadMore = result.value.games.length === pageSize;

    return {
      games: result.value.games.map(game => ({ id: game.id, imageUrl: game.imageUrl })),
      canLoadMore,
      totalGames: result.value.pagination.totalItems,
    };
  }
}
