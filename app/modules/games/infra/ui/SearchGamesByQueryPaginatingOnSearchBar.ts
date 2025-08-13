import type { GameSearchResponse } from "../../domain/Game";
import type { GamesApiRepositoryI } from "../../domain/GamesApiRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchGamesByQueryPaginatingOnSearchBar {
  constructor(
    private apiRepository: GamesApiRepositoryI,
    private logger: LoggerI,
  ) {

  }

  public static PAGINATION_SIZE = 24;

  public async handle(query: string, pageToSearch: number): Promise<{
    searchResults: GameSearchResponse[];
    canLoadMore: boolean;
    totalGames: number;
  }> {
    const result = await this.apiRepository.searchPaginating({ query }, {
      offset: pageToSearch * SearchGamesByQueryPaginatingOnSearchBar.PAGINATION_SIZE,
      limit: SearchGamesByQueryPaginatingOnSearchBar.PAGINATION_SIZE,
    });

    if (result.isFailure) {
      // Optional TODO: alert the customer somehow in case of error
      this.logger.error("SearchGamesByQueryPaginatingOnSearchBar failed: ", result.error, { query });
      return {
        searchResults: [],
        canLoadMore: false,
        totalGames: 0,
      };
    }

    const canLoadMore = result.value.searchResults.length === SearchGamesByQueryPaginatingOnSearchBar.PAGINATION_SIZE;

    return {
      searchResults: result.value.searchResults,
      canLoadMore,
      totalGames: result.value.pagination.totalItems,
    };
  }
}
