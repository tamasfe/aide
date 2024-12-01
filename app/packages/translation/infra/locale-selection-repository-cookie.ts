import type { SupportedLocale } from "..";
import type { LocaleSelectionRepositoryI } from "../domain/locale-selection-repository";
import { isSupportedLocale } from "../utils";
import type { CookieRef } from "#app";
import { type Result, type EmptyResult, fail, success } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";

export class LocaleSelectionRepositoryCookie implements LocaleSelectionRepositoryI {
  private COOKIE_NAME = "i18n_user_preferred" as const;

  public async searchSelectedLocale(): Promise<Result<SupportedLocale | null, InfrastructureError>> {
    try {
      const cookieLocale = this.useCookie();

      if (!cookieLocale.value || !isSupportedLocale(cookieLocale.value)) {
        return success(null);
      }

      return success(cookieLocale.value);
    }
    catch (error) {
      return fail(
        InfrastructureError.newFromUnknownError({}, error),
      );
    }
  }

  public async saveSelectedLocale(locale: SupportedLocale): Promise<EmptyResult<InfrastructureError>> {
    try {
      const cookieLocale = this.useCookie();
      cookieLocale.value = locale;
      return success();
    }
    catch (error) {
      return fail(
        InfrastructureError.newFromUnknownError({ locale }, error),
      );
    }
  }

  private useCookie(): CookieRef<SupportedLocale | null> {
    const inOneYear = new Date(Date.now() + 365 * 24 * 3600 * 1000);
    return useCookie<SupportedLocale | null>(this.COOKIE_NAME, { default: () => null, expires: inOneYear });
  }
}
