import type { SupportedLocale } from "..";
import type { EmptyResult, Result } from "../../result";
import type { InfrastructureError } from "../../result/infrastructure-error";

export interface LocaleSelectionRepositoryI {
  searchSelectedLocale(): Promise<Result<SupportedLocale | null, InfrastructureError>>;
  saveSelectedLocale(locale: SupportedLocale): Promise<EmptyResult<InfrastructureError>>;
}
