import type { SearchGamesByCategoryPaginating } from "../../application/SearchGamesByCategoryPaginating";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchGamesByCategoryPaginatingOnSlider {
  constructor(
    private query: SearchGamesByCategoryPaginating,
    private logger: LoggerI,
  ) {

  }

  public static PAGINATION_SIZE = 25;

  public async handle(categoryIdentifier: string, pageToSearch: number): Promise<{
    games: { id: number }[];
    canLoadMore: boolean;
    totalGames: number;
  }> {
    const result = await this.query.handle(categoryIdentifier, pageToSearch, SearchGamesByCategoryPaginatingOnSlider.PAGINATION_SIZE);

    if (result.isFailure) {
      // TODO: log exception so we can track it. And perhaps alert the customer somehow
      this.logger.error("SearchGamesByCategoryPaginating failed: ", { error: result.error });
      return {
        games: [],
        canLoadMore: false,
        totalGames: 0,
      };
    }

    const canLoadMore = result.value.games.length === SearchGamesByCategoryPaginatingOnSlider.PAGINATION_SIZE;

    return {
      games: result.value.games.map(game => ({ id: game.id })),
      canLoadMore,
      totalGames: result.value.pagination.totalItems,
    };
  }
}
