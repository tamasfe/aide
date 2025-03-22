import type { SearchGamesPaginating } from "../../application/SearchGamesPaginating";
import type { GameSummaryI } from "../../domain/Game";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchGamesByQueryPaginatingOnSearchBar {
  constructor(
    private query: SearchGamesPaginating,
    private logger: LoggerI,
  ) {

  }

  public static PAGINATION_SIZE = 25;

  public async handle(query: string, pageToSearch: number): Promise<{
    games: GameSummaryI[];
    canLoadMore: boolean;
    totalGames: number;
  }> {
    const result = await this.query.handle(null, query, null, pageToSearch, SearchGamesByQueryPaginatingOnSearchBar.PAGINATION_SIZE);

    if (result.isFailure) {
      // Optional TODO: alert the customer somehow in case of error
      this.logger.error("SearchGamesByQueryPaginatingOnSearchBar failed: ", result.error, { query });
      return {
        games: [],
        canLoadMore: false,
        totalGames: 0,
      };
    }

    const canLoadMore = result.value.games.length === SearchGamesByQueryPaginatingOnSearchBar.PAGINATION_SIZE;

    return {
      games: result.value.games,
      canLoadMore,
      totalGames: result.value.pagination.totalItems,
    };
  }
}
