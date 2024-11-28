import type { SupportedLocale } from "../..";
import type { LocaleSelectionRepositoryI } from "../../domain/locale-selection-repository";
import { isSupportedLocale } from "../../utils";
import { ErrorUnsupportedLocale } from "../../domain/ErrorUnsupportedLocale";
import type { LoggerI } from "~/packages/logger/Logger";

export class UserSelectsLocale {
  constructor(
    private readonly localeSelectionRepository: LocaleSelectionRepositoryI,
    private readonly setLocale: (locale: SupportedLocale) => Promise<void>,
    private readonly logger: LoggerI,
  ) {}

  public async handle(locale: string) {
    if (!isSupportedLocale(locale)) {
      this.logger.error("Error saving the selected user locale",
        new ErrorUnsupportedLocale(locale),
      );
      return;
    }

    const resultSavingSelectedLocale = await this.localeSelectionRepository.saveSelectedLocale(locale);

    if (resultSavingSelectedLocale.isFailure) {
      this.logger.error("Error saving the selected user locale", resultSavingSelectedLocale.error);
      return;
    }

    await this.setLocale(locale);

    return;
  }
}
