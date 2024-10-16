import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface UserLanguageRetrieverI {
  search(): Promise<Result<string | null, InfrastructureError>>;
}
