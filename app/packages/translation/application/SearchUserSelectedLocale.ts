import type { LocaleSelectionRepositoryI } from "../domain/locale-selection-repository";

export class SearchUserSelectedLocale {
  constructor(
    private readonly localeSelectionRepository: LocaleSelectionRepositoryI,
  ) {}

  public async handle() {
    const result = await this.localeSelectionRepository.searchSelectedLocale();

    // In the future, we might want to return the user account locale as a fallback here

    return result;
  }
}
