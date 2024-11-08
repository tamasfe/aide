import type { SearchGameCategoriesByCategoryGroup } from "../../application/SearchGameCategoriesByCategoryGroup";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchGameCategoriesByGroup {
  constructor(
    private readonly query: SearchGameCategoriesByCategoryGroup,
    private readonly logger: LoggerI,
  ) {}

  public async handle(group: string) {
    const result = await this.query.handle(group);
    if (result.isFailure) {
      this.logger.error("Error while searching game categories by group", result.error);
      return [];
    }

    return result.value;
  }
}
