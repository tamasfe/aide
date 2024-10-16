import type { UpsertSignupFlow } from "../../application/UpsertSignupFlow";
import type { LoggerI } from "~/packages/logger/Logger";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";

export class ValidateTelephoneUpsertingSignupFlowOnTelephoneValueChanged {
  public async handle(value: unknown, prefixValue: string): Promise<boolean | string> {
    const telephoneValue = String(value);

    // TODO: move this validation to a Telephone value object
    const cleanTelephoneValue = telephoneValue.replace(/\D/g, "");

    if (!value || !cleanTelephoneValue) {
      return this.translateFunction("validation.telephone_required");
    }

    const telephoneWithPrefix = `${prefixValue}${cleanTelephoneValue}`;

    const resultUpsertingSignupFlow = await this.upsertSignupFlow.handle({
      CPF: null,
      email: null,
      password: null,
      telephone: telephoneWithPrefix,
    });

    if (resultUpsertingSignupFlow.isFailure) {
      this.logger.error("Error while upserting the signup flow with the telephone", { error: resultUpsertingSignupFlow.error });
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
