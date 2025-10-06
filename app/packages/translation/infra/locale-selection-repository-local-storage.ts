import { fail, success, type EmptyResult, type Result } from "../../result";
import { InfrastructureError } from "../../result/infrastructure-error";
import type { LocaleSelectionRepositoryI } from "../domain/locale-selection-repository";
import { isSupportedLocale } from "../utils";
import type { SupportedLocale } from "..";

export class LocaleSelectionRepositoryLocalStorage implements LocaleSelectionRepositoryI {
  public async searchSelectedLocale(): Promise<Result<SupportedLocale | null, InfrastructureError>> {
    if (!this.isLocalStorageAvailable()) {
      return fail(
        InfrastructureError.newFromError({}, new Error("This repo should only be run in the client side. LocalStorage is not available on server side rendering")),
      );
    }

    try {
      const locale = window.localStorage.getItem(this.STORAGE_ID_KEY);
      if (locale === null || !isSupportedLocale(locale)) {
        return success(null);
      }

      return success(locale);
    }
    catch (error) {
      return fail(
        InfrastructureError.newFromUnknownError({}, error),
      );
    }
  }

  public async saveSelectedLocale(locale: SupportedLocale): Promise<EmptyResult<InfrastructureError>> {
    if (!this.isLocalStorageAvailable()) {
      return fail(
        InfrastructureError.newFromError({}, new Error("This repo should only be run in the client side. LocalStorage is not available on server side rendering")),
      );
    }

    try {
      window.localStorage.setItem(this.STORAGE_ID_KEY, locale);
      return success();
    }
    catch (error) {
      return fail(
        InfrastructureError.newFromUnknownError({ locale }, error),
      );
    }
  }

  private isLocalStorageAvailable() {
    return typeof window !== "undefined" && window.localStorage;
  }

  private STORAGE_ID_KEY = "locale-user-selected" as const;
}
