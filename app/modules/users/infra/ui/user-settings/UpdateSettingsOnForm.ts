import type { UpdateUserSettings } from "../../../application/UpdateUserSettings";
import type { SupportedLocale, TranslateFunctionType } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { UserSettingsPaymentPixPropsI } from "~/modules/users/domain/UserSettingsPaymentPix";

export class UpdateSettingsOnForm {
  constructor(
    private readonly command: UpdateUserSettings,
    private readonly logger: LoggerI,
    private readonly t: TranslateFunctionType,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(settings: {
    locale?: SupportedLocale; timeZone?: string;
    password?: { current: string; new: string };
    payment?: UserSettingsPaymentPixPropsI;
  }) {
    const result = await this.command.handle(settings);
    if (result.isFailure) {
      if (result.error.name === "ErrorInvalidCurrentPassword") {
        return this.t("modal_account_settings.password.error_invalid_current_password");
      }
      this.logger.error("Failed to update user settings", result.error);
      return this.t("modal_account_settings.error_unknown");
    }

    await this.asyncMessagePublisher.emit("frontend:commands:modals:close-user-interaction-modal", {});

    return "";
  }
}
