import type { SearchProvidersPaginating } from "../../application/SearchProvidersPaginating";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchProvidersOnGrid {
  constructor(
    private readonly query: SearchProvidersPaginating,
    private logger: LoggerI
  ) {}

  static PAGE_SIZE = 24;

  public async handle(query: string | null, page: number) {
    const result = await this.query.handle(
      query,
      page,
      SearchProvidersOnGrid.PAGE_SIZE
    );
    if (result.isFailure) {
      this.logger.error(
        "Unexpected error while trying to search for providers",
        result.error,
        { page, pageSize: SearchProvidersOnGrid.PAGE_SIZE }
      );
      return {
        results: [],
        pagination: {
          limit: SearchProvidersOnGrid.PAGE_SIZE,
          offset: page * SearchProvidersOnGrid.PAGE_SIZE,
          totalItems: 0,
        },
      };
    }

    return result.value;
  }
}
