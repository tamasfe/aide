import type { SearchProvidersPaginating } from "../../application/SearchProvidersPaginating";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchAllProvidersOnHorizontalGrid {
  constructor(private readonly query: SearchProvidersPaginating, private logger: LoggerI) {}

  static PAGE_SIZE = 25;

  public async handle(page: number) {
    const result = await this.query.handle(null, null, page, SearchAllProvidersOnHorizontalGrid.PAGE_SIZE);
    if (result.isFailure) {
      this.logger.error("Unexpected error while trying to search all providers on the horizontal grid", { error: result.error, page, pageSize: SearchAllProvidersOnHorizontalGrid.PAGE_SIZE });
      return { providers: [], canLoadMore: false };
    }

    return { providers: result.value.providers, canLoadMore: result.value.providers.length === SearchAllProvidersOnHorizontalGrid.PAGE_SIZE };
  }
}
