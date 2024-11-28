import type { LocaleSelectionRepositoryI } from "../domain/locale-selection-repository";
import type { SupportedLanguage } from "..";
import { searchSimilarLocale } from "../utils";
import { success } from "~/packages/result";

export class FindLocaleForUser {
  constructor(
    private readonly localeSelectionRepository: LocaleSelectionRepositoryI,
    private readonly getBrowserLocale: () => string | undefined,

  ) {}

  public FALLBACK_LANGUAGE: SupportedLanguage = {
    value: "en-us",
    countryCode: "US",
  };

  public async handle() {
    const result = await this.localeSelectionRepository.searchSelectedLocale();
    if (result.isFailure) {
      return result;
    }
    if (result.value) {
      return success(result.value);
    }

    const browserLocale = this.getBrowserLocale();
    if (!browserLocale) {
      return success(this.FALLBACK_LANGUAGE.value);
    }

    const supportedBrowserLocaleOrNull = searchSimilarLocale(browserLocale);
    if (supportedBrowserLocaleOrNull) {
      return success(supportedBrowserLocaleOrNull);
    }

    return success(this.FALLBACK_LANGUAGE.value);
  }
}
