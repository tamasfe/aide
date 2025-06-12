import type { UpdateUserSettingsChangedConsents } from "~/modules/users/application/UpdateUserSettingsChangedConsents";
import type { LoggerI } from "~/packages/logger/Logger";
import type { TranslateFunctionType } from "~/packages/translation";

export class UpdateConsentsOnPreferencesPage {
  constructor(
    private command: UpdateUserSettingsChangedConsents,
    private logger: LoggerI,
    private t: TranslateFunctionType,
  ) {}

  public async handle(
    initialConsents: {
      email: boolean | null;
      phone: boolean | null;
      browser: boolean | null;
    },
    newConsents: {
      email: boolean;
      phone: boolean;
      browser: boolean;
    },
  ) {
    const result = await this.command.handle(
      initialConsents,
      newConsents,
    );

    if (result.isFailure) {
      this.logger.error("Unexpected error while updating the user settings consents on the preferences page", result.error, { initialConsents, newConsents });
      return this.t("dashboard.settings.preferences.error_updating_settings");
    }

    return null;
  }
}
