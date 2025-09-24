import type { Game } from "../../domain/Game";
import type { GamesApiRepositoryI } from "../../domain/GamesApiRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class ListGamesPaginatingOnGrid {
  constructor(
    private apiRepository: GamesApiRepositoryI,
    private logger: LoggerI,
  ) {}

  public static DEFAULT_PAGINATION_SIZE = 24;

  public async handle(categoryIdentifier: string | null, providerIdentifier: string | null, pageToSearch: number, pageSize = ListGamesPaginatingOnGrid.DEFAULT_PAGINATION_SIZE): Promise<{
    games: Game[];
    canLoadMore: boolean;
    totalGames: number;
  }> {
    const result = await this.apiRepository.listPaginating({ category: categoryIdentifier, providerIdentifier },
      {
        limit: pageSize,
        offset: pageToSearch * pageSize,
      },
    );

    if (result.isFailure) {
      // Optional TODO: alert the customer somehow in case of error
      this.logger.error("ListGamesPaginatingOnGrid failed", result.error);
      return {
        games: [],
        canLoadMore: false,
        totalGames: 0,
      };
    }

    const canLoadMore = result.value.games.length === pageSize;

    return {
      games: result.value.games,
      canLoadMore,
      totalGames: result.value.pagination.totalItems,
    };
  }
}
