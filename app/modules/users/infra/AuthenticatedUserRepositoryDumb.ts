import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import type { User } from "../domain/User";
import { UserSettings } from "../domain/UserSettings";
import type { ErrorInvalidCurrentPassword } from "../domain/errors/ErrorInvalidCurrentPassword";
import type { ErrorUsernameIsTaken } from "../domain/errors/ErrorUsernameIsTaken";
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

  public async searchSettings() {
    this.logger.debug("searchSettings called");
    return success(UserSettings.new({
      locale: "en-us",
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
        keyEmail: null,
        keyEvp: null,
        keyPhone: null,
        keyType: null,
      },
    }));
  }

  public async closeAccount(reason: string | null, currentPassword: string): Promise<EmptyResult<ErrorInvalidCurrentPassword | InfrastructureError>> {
    this.logger.debug("closeAccount called", { reason, currentPassword });
    return success();
  }

  public async updateSettings(settings: { locale?: SupportedLocale }): Promise<EmptyResult<InfrastructureError>> {
    this.logger.debug("updateSettings called", { settings });
    return success();
  }

  public async updatePassword(currentPassword: string, newPassword: string): Promise<EmptyResult<InfrastructureError>> {
    this.logger.debug("updatePassword called", { currentPassword, newPassword });
    return success();
  }

  public async updateUsername(username: string): Promise<EmptyResult<ErrorUsernameIsTaken | InfrastructureError>> {
    this.logger.debug("updateUsername called", { username });
    return success();
  }
}
