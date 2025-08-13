import type { Provider } from "../../domain/Provider";
import type { ProvidersRepositoryI } from "../../domain/ProvidersRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class ListGameProvidersPaginatingOnGrid {
  constructor(
    private apiRepository: ProvidersRepositoryI,
    private logger: LoggerI,
  ) {}

  public static DEFAULT_PAGINATION_SIZE = 25;

  public async handle(page: number, count = ListGameProvidersPaginatingOnGrid.DEFAULT_PAGINATION_SIZE): Promise<{
    game_providers: Provider[];
    canLoadMore: boolean;
    totalProviders: number;
  }> {
    const result = await this.apiRepository.listPaginating(
      {
        limit: count,
        offset: page * count,
      },
    );

    if (result.isFailure) {
      // Optional TODO: alert the customer somehow in case of error
      this.logger.error("ListGameProvidersPaginatingOnGrid failed", result.error);
      return {
        game_providers: [],
        canLoadMore: false,
        totalProviders: 0,
      };
    }

    const canLoadMore = result.value.game_providers.length === count;

    return {
      game_providers: result.value.game_providers,
      canLoadMore,
      totalProviders: result.value.pagination.totalItems,
    };
  }
}
