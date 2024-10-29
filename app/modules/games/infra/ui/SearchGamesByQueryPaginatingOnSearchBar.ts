import type { SearchGamesPaginating } from "../../application/SearchGamesPaginating";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchGamesByQueryPaginatingOnSearchBar {
  constructor(
    private query: SearchGamesPaginating,
    private logger: LoggerI,
  ) {

  }

  public static PAGINATION_SIZE = 25;

  public async handle(query: string, pageToSearch: number): Promise<{
    games: { id: number }[];
    canLoadMore: boolean;
    totalGames: number;
  }> {
    const result = await this.query.handle(null, query, pageToSearch, SearchGamesByQueryPaginatingOnSearchBar.PAGINATION_SIZE);

    if (result.isFailure) {
      // Optional TODO: alert the customer somehow in case of error
      this.logger.error("SearchGamesByQueryPaginatingOnSearchBar failed: ", { error: result.error, query });
      return {
        games: [],
        canLoadMore: false,
        totalGames: 0,
      };
    }

    const canLoadMore = result.value.games.length === SearchGamesByQueryPaginatingOnSearchBar.PAGINATION_SIZE;

    return {
      games: result.value.games.map(game => ({ id: game.id })),
      canLoadMore,
      totalGames: result.value.pagination.totalItems,
    };
  }
}
