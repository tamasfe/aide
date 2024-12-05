import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import type { User } from "../domain/User";
import type { UserSettingsI } from "../domain/UserSettings";
import type { LoggerI } from "~/packages/logger/Logger";
import { success, type EmptyResult, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { SupportedLocale } from "~/packages/translation";

export class AuthenticatedUserRepositoryDumb implements AuthenticatedUserRepositoryI {
  constructor(private logger: LoggerI) {}

  public async searchProfile(): Promise<Result<User | null, InfrastructureError>> {
    this.logger.debug("searchProfile called");
    // return fail(
    //   InfrastructureError.newFromError({}, new Error("fuckall")),
    // );
    // return success(
    //   User.newFromProps({
    //     id: 1,
    //     locale: "pt-br",
    //     timeZone: "America/Sao_Paulo",
    //     jurisdiction: "BR",
    //     email: "ivan@girobet.com",
    //     telephone: "+5511999999999",
    //   }),
    // );
    return success(null);
  }

  public async searchSettings(): Promise<Result<null | UserSettingsI, InfrastructureError>> {
    this.logger.debug("searchSettings called");
    return success({
      timeZone: null,
      consents: {
        email: false,
        postMail: false,
        pushNotification: false,
        siteNotification: false,
        sms: false,
        telephone: false,
      },
      payment: {
        pixKeyEmail: null,
        pixKeyEvp: null,
        pixKeyPhone: null,
        pixKeyType: null,
      },
    });
  }

  public async updateSettings(settings: { locale?: SupportedLocale }): Promise<EmptyResult<InfrastructureError>> {
    this.logger.debug("updateSettings called", { settings });
    return success();
  }

  public async updatePassword(currentPassword: string, newPassword: string): Promise<EmptyResult<InfrastructureError>> {
    this.logger.debug("updatePassword called", { currentPassword, newPassword });
    return success();
  }
}
