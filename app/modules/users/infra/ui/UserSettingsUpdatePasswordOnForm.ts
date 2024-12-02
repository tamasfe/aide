import type { UpdateUserSettings } from "../../application/UpdateUserSettings";
import type { TranslateFunctionType } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class UserSettingsUpdatePasswordOnForm {
  constructor(
    private readonly command: UpdateUserSettings,
    private readonly logger: LoggerI,
    private readonly t: TranslateFunctionType,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(currentPassword: string, newPassword: string) {
    const result = await this.command.handle({ password: { new: newPassword, current: currentPassword } });
    if (result.isFailure) {
      if (result.error.name === "ErrorInvalidCurrentPassword") {
        return this.t("modal_user_settings.password.error_invalid_current_password");
      }
      this.logger.error("Failed to update password", result.error);
      return this.t("modal_user_settings.password.error_unknown");
    }

    await this.asyncMessagePublisher.emit("girobet:commands:modals:close-user-interaction-modal", {});

    return "";
  }
}
