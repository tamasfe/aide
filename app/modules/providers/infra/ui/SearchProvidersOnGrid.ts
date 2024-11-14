import type { SearchProvidersPaginating } from "../../application/SearchProvidersPaginating";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchProvidersOnGrid {
  constructor(private readonly query: SearchProvidersPaginating, private logger: LoggerI) {}

  static PAGE_SIZE = 25;

  public async handle(query: string | null, page: number) {
    const result = await this.query.handle(query, page, SearchProvidersOnGrid.PAGE_SIZE);
    if (result.isFailure) {
      this.logger.error("Unexpected error while trying to search for providers", result.error, { page, pageSize: SearchProvidersOnGrid.PAGE_SIZE });
      return { providers: [], totalProviders: 0, canLoadMore: false };
    }

    return { providers: result.value.providers, totalProviders: result.value.pagination.totalItems, canLoadMore: result.value.providers.length === SearchProvidersOnGrid.PAGE_SIZE };
  }
}
