import type { AuthenticationRepositoryI } from "../../domain/AuthenticationRepository";
import { UserEmail } from "../../domain/UserEmail";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { TranslateFunctionType } from "~/packages/translation";

export class RequestRecoverPasswordOnForm {
  constructor(
    private authenticationRepo: AuthenticationRepositoryI,
    private asyncMessagePublisher: AsyncMessagePublisherI,
    private t: TranslateFunctionType,
  ) {}

  public async handle(email: string): Promise<string | null> {
    if (!email) {
      return this.t("validation.email_required");
    }

    const emailResult = UserEmail.new(email);
    if (emailResult.isFailure) {
      return this.t("validation.email_invalid");
    }

    const result = await this.authenticationRepo.requestResetPassword(emailResult.value);
    if (result.isFailure) {
      return this.t("modal_forgot_password.error_unknown");
    }

    await this.asyncMessagePublisher.emit("girobet:commands:modals:close-user-interaction-modal", {});

    return null;
  }
}
