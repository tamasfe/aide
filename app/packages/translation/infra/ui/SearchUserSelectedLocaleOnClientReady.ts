import type { SupportedLocale } from "../..";
import type { SearchUserSelectedLocale } from "../../application/SearchUserSelectedLocale";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchUserSelectedLocaleOnClientReady {
  constructor(
    private readonly query: SearchUserSelectedLocale,
    private readonly logger: LoggerI,
  ) {}

  public async handle(): Promise<SupportedLocale | null> {
    const result = await this.query.handle();
    if (result.isFailure) {
      this.logger.error("Error finding the best locale for the user", result.error);
      return null;
    }
    return result.value;
  }
}
