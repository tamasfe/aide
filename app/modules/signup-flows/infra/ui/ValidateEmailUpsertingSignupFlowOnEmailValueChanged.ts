import type { UpsertSignupFlow } from "../../application/UpsertSignupFlow";
import type { LoggerI } from "~/packages/logger/Logger";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";

export class ValidateEmailUpsertingSignupFlowOnEmailValueChanged {
  public async handle(value: unknown): Promise<boolean | string> {
    const emailValue = String(value);

    if (!value || !emailValue) {
      return this.translateFunction("validation.email_required");
    }

    const resultUpsertingSignupFlow = await this.upsertSignupFlow.handle({
      CPF: null,
      email: emailValue,
      password: null,
      telephone: null,
      telephonePrefix: null,
    });

    if (resultUpsertingSignupFlow.isFailure) {
      if (resultUpsertingSignupFlow.error.name === "InvalidUserEmail") {
        return this.translateFunction("validation.email_invalid");
      }

      this.logger.error("Error while upserting the signup flow with the email", resultUpsertingSignupFlow.error);
      return this.translateFunction("modal_session.error_validating_field");
    }

    return true;
  }

  constructor(
    private upsertSignupFlow: UpsertSignupFlow,
    private translateFunction: TranslateFunctionType,
    private logger: LoggerI,
  ) {

  }
}
