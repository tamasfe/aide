import type { UserLanguageRetrieverI } from "../domain/UserLanguageRetriever";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { FindLocaleForUser } from "~/packages/translation/application/FindLocaleForUser";

export class UserLanguageRetrieverQuery implements UserLanguageRetrieverI {
  constructor(
    private query: FindLocaleForUser,
  ) {}

  public async search(): Promise<Result<string | null, InfrastructureError>> {
    return this.query.handle();
  }
}
