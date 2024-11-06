import type { SearchGamesPaginating } from "../../application/SearchGamesPaginating";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchGamesPaginatingOnGrid {
  constructor(
    private query: SearchGamesPaginating,
    private logger: LoggerI,
  ) {

  }

  public static PAGINATION_SIZE = 25;

  public async handle(categoryIdentifier: string | null, providerId: number | null, pageToSearch: number): Promise<{
    games: { id: number }[];
    canLoadMore: boolean;
    totalGames: number;
  }> {
    const result = await this.query.handle(categoryIdentifier, null, providerId, pageToSearch, SearchGamesPaginatingOnGrid.PAGINATION_SIZE);

    if (result.isFailure) {
      // Optional TODO: alert the customer somehow in case of error
      this.logger.error("SearchGamesPaginatingOnGrid failed", { error: result.error });
      return {
        games: [],
        canLoadMore: false,
        totalGames: 0,
      };
    }

    const canLoadMore = result.value.games.length === SearchGamesPaginatingOnGrid.PAGINATION_SIZE;

    return {
      games: result.value.games.map(game => ({ id: game.id })),
      canLoadMore,
      totalGames: result.value.pagination.totalItems,
    };
  }
}
