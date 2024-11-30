import type { SupportedLocale } from "..";
import type { LocaleSelectionRepositoryI } from "../domain/locale-selection-repository";
import { isSupportedLocale } from "../utils";
import { type Result, type EmptyResult, fail, success } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";

export class LocaleSelectionRepositoryCookie implements LocaleSelectionRepositoryI {
  private STORAGE_ID_KEY = "i18n_user_preferred" as const;

  public async searchSelectedLocale(): Promise<Result<SupportedLocale | null, InfrastructureError>> {
    if (!this.isDocumentAvailable()) {
      return fail(
        InfrastructureError.newFromError({}, new Error("This repo should only be run in the client side. Cookies are not available on server side rendering")),
      );
    }

    try {
      const cookieLocale = this.getCookie(this.STORAGE_ID_KEY);
      if (!cookieLocale || !isSupportedLocale(cookieLocale)) {
        return success(null);
      }

      return success(cookieLocale);
    }
    catch (error) {
      return fail(
        InfrastructureError.newFromUnknownError({}, error),
      );
    }
  }

  public async saveSelectedLocale(locale: SupportedLocale): Promise<EmptyResult<InfrastructureError>> {
    if (!this.isDocumentAvailable()) {
      return fail(
        InfrastructureError.newFromError({}, new Error("This repo should only be run in the client side. Cookies are not available on server side rendering")),
      );
    }

    try {
      this.setCookie(this.STORAGE_ID_KEY, locale);
      return success();
    }
    catch (error) {
      return fail(
        InfrastructureError.newFromUnknownError({ locale }, error),
      );
    }
  }

  private isDocumentAvailable() {
    return typeof document !== "undefined" && document.cookie;
  }

  private setCookie(name: string, value: string, days = 365) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  private getCookie(name: string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i] as string;
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}
