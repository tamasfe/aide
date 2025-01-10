import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import { UserSettingsPaymentPix, type UserSettingsPaymentPixPropsI } from "../domain/UserSettingsPaymentPix";
import type { SupportedLocale } from "~/packages/translation";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { success } from "~/packages/result";

export class UpdateUserSettings {
  public constructor(
    private readonly authenticatedUserRepository: AuthenticatedUserRepositoryI,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(settings: {
    locale?: SupportedLocale;
    timeZone?: string;
    password?: {
      current: string;
      new: string;
    };
    username?: string;
    consents?: {
      email?: boolean | null;
      postMail?: boolean | null;
      pushNotification?: boolean | null;
      siteNotification?: boolean | null;
      sms?: boolean | null;
      telephone?: boolean | null;
    };
    payment?: UserSettingsPaymentPixPropsI;
  }) {
    if (settings.locale !== undefined || settings.consents !== undefined || settings.timeZone !== undefined) {
      const settingsResult = await this.authenticatedUserRepository.updateSettings({
        locale: settings.locale,
        timeZone: settings.timeZone,
        consents: settings.consents,
      });
      if (settingsResult.isFailure) {
        return settingsResult;
      }
    }

    if (settings.payment) {
      const pixPaymentSettings = UserSettingsPaymentPix.new(settings.payment);
      const settingsResult = await this.authenticatedUserRepository.updateSettings({ payment: {
        pixKeyType: pixPaymentSettings.toJSON().keyType,
        pixKeyEmail: pixPaymentSettings.toJSON().keyEmail,
        pixKeyEvp: pixPaymentSettings.toJSON().keyEvp,
        pixKeyPhone: pixPaymentSettings.toJSON().keyPhone,
      } });
      if (settingsResult.isFailure) {
        return settingsResult;
      }
    }

    if (settings.password) {
      const passwordResult = await this.authenticatedUserRepository.updatePassword(settings.password.current, settings.password.new);
      if (passwordResult.isFailure) {
        return passwordResult;
      }
    }

    if (settings.username) {
      const updateUsernameResult = await this.authenticatedUserRepository.updateUsername(settings.username);
      if (updateUsernameResult.isFailure) {
        return updateUsernameResult;
      }
    }

    await this.asyncMessagePublisher.emit("girobet:events:users:user-settings-updated", {
      settings: {
        locale: settings.locale,
        password: settings.password ? true : false,
        consents: settings.consents,
        payment: settings.payment,
        username: settings.username,
      },
    });

    return success();
  }
}
