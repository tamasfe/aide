import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
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
    password?: {
      current: string;
      new: string;
    };
    consents?: {
      email?: boolean | null;
      postMail?: boolean | null;
      pushNotification?: boolean | null;
      siteNotification?: boolean | null;
      sms?: boolean | null;
      telephone?: boolean | null;
    };
  }) {
    if (settings.locale || settings.consents) {
      const settingsResult = await this.authenticatedUserRepository.updateSettings(settings);
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

    await this.asyncMessagePublisher.emit("girobet:events:users:user-settings-updated", {
      settings: {
        locale: settings.locale,
        password: settings.password ? true : false,
        consents: settings.consents,
      },
    });

    return success();
  }
}
