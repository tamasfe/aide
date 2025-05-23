import { ErrorUsernameIsTaken } from "../../domain/errors/ErrorUsernameIsTaken";
import type { UpdateUserSettings } from "../../application/UpdateUserSettings";
import { ErrorUsernameCannotBeExplicit } from "../../domain/errors/ErrorUsernameCannotBeExplicit";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { LoggerI } from "~/packages/logger/Logger";
import type { TranslateFunctionType } from "~/packages/translation";

export class UpdateUsernameOnFormSubmission {
  constructor(
    private readonly command: UpdateUserSettings,
    private readonly t: TranslateFunctionType,
    private readonly asyncMessagePublisher: AsyncMessagePublisherI,
    private readonly logger: LoggerI,
  ) {}

  public async handle(username: string) {
    const resultUpdating = await this.command.handle({ username });
    if (resultUpdating.isFailure) {
      if (resultUpdating.error instanceof ErrorUsernameIsTaken) {
        return this.t("modal_user_settings.username.error_already_taken");
      }
      if (resultUpdating.error instanceof ErrorUsernameCannotBeExplicit) {
        return this.t("modal_user_settings.username.error_explicit");
      }
      this.logger.error("Unrecognized error updating username", resultUpdating.error);
      return this.t("modal_user_settings.username.error_unknown");
    }

    await this.asyncMessagePublisher.emit("frontend:commands:modals:close-user-interaction-modal", {});

    return "";
  }
}
