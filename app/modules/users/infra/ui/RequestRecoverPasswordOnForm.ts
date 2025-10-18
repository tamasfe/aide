import type { LoggerI } from "~/packages/logger/Logger";
import type { AuthenticationRepositoryI } from "../../domain/AuthenticationRepository";
import { UserEmail } from "../../domain/UserEmail";
import type { TranslateFunctionType } from "~/packages/translation";
import type { NuxtApp } from "#app";

export class RequestRecoverPasswordOnForm {
  constructor(
    private authenticationRepo: AuthenticationRepositoryI,
    private nuxtApp: NuxtApp,
    private logger: LoggerI,
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
      this.logger.error("Error requesting password recovery", result.error, { email });
      return this.t("modal_forgot_password.error_unknown");
    }

    await this.nuxtApp.callHook("frontend:commands:modals:close-user-interaction-modal");

    return null;
  }
}
