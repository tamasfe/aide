import type { SearchGamesPaginating } from "../../application/SearchGamesPaginating";
import { ErrorSearchIndexNotFound } from "../../domain/ErrorSearchIndexNotFound";
import type { GameSearchResponse } from "../../domain/Game";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchGamesPaginatingOnGrid {
  constructor(
    private query: SearchGamesPaginating,
    private logger: LoggerI,
  ) {}

  public static DEFAULT_PAGINATION_SIZE = 25;

  public async handle(categoryIdentifier: string | null, providerIdentifier: string | null, pageToSearch: number, pageSize = SearchGamesPaginatingOnGrid.DEFAULT_PAGINATION_SIZE): Promise<{
    searchResults: GameSearchResponse[];
    canLoadMore: boolean;
    totalGames: number;
  }> {
    const result = await this.query.handle(categoryIdentifier, null, providerIdentifier, pageToSearch, pageSize);

    if (result.isFailure) {
      if (result.error instanceof ErrorSearchIndexNotFound) {
        this.logger.warn("The search index was not found", { error: result.error });
        return {
          searchResults: [],
          canLoadMore: false,
          totalGames: 0,
        };
      }

      // Optional TODO: alert the customer somehow in case of error
      this.logger.error("SearchGamesPaginatingOnGrid failed", result.error);
      return {
        searchResults: [],
        canLoadMore: false,
        totalGames: 0,
      };
    }

    const canLoadMore = result.value.searchResults.length === pageSize;

    return {
      searchResults: result.value.searchResults,
      canLoadMore,
      totalGames: result.value.pagination.totalItems,
    };
  }
}
