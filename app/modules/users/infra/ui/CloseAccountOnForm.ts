import type { CloseAccount } from "../../application/CloseAccount";
import type { TranslateFunctionType } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class CloseAccountOnForm {
  constructor(private command: CloseAccount, private logger: LoggerI, private asyncMessagePublisher: AsyncMessagePublisherI, private t: TranslateFunctionType) {}

  public async handle(reason: string | undefined, currentPassword: string) {
    const result = await this.command.handle(reason || null, currentPassword);
    if (result.isFailure) {
      if (result.error.name === "ErrorInvalidCurrentPassword") {
        return this.t("validation.password_invalid");
      }

      this.logger.error("Error attempting to close account", result.error, { reason });
      return this.t("modal_close_account.error_unknown");
    }

    await this.asyncMessagePublisher.emit("frontend:commands:modals:close-user-interaction-modal", {});

    return "";
  }
}
