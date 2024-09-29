import type { SearchGamesByCategoryPaginating } from "../../application/SearchGamesByCategoryPaginating";

export class SearchGamesByCategoryPaginatingOnHorizontalSlider {
  constructor(
    private query: SearchGamesByCategoryPaginating,
  ) {

  }

  public static PAGINATION_SIZE = 20;

  public async handle(categoryIdentifier: string, pageToSearch: number): Promise<{
    games: { id: number }[];
    canLoadMore: boolean;
  }> {
    const result = await this.query.handle(categoryIdentifier, pageToSearch, SearchGamesByCategoryPaginatingOnHorizontalSlider.PAGINATION_SIZE);

    if (result.isFailure) {
      // TODO: log exception so we can track it. And perhaps alert the customer somehow
      return {
        games: [],
        canLoadMore: false,
      };
    }

    const canLoadMore = result.value.games.length === SearchGamesByCategoryPaginatingOnHorizontalSlider.PAGINATION_SIZE;

    return {
      games: result.value.games.map(game => ({ id: game.id })),
      canLoadMore,
    };
  }
}
