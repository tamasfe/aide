import type { SupportedLocale } from "../..";
import type { FindLocaleForUser } from "../../application/FindLocaleForUser";
import type { LoggerI } from "~/packages/logger/Logger";

export class FindLocaleForUserOnInit {
  constructor(
    private readonly query: FindLocaleForUser,
    private readonly logger: LoggerI,
  ) {}

  public async handle(): Promise<SupportedLocale> {
    const result = await this.query.handle();
    if (result.isFailure) {
      this.logger.error("Error finding the best locale for the user", result.error);
      return this.query.FALLBACK_LANGUAGE.value;
    }
    return result.value;
  }
}
