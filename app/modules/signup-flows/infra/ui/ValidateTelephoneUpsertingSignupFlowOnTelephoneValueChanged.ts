import type { UpsertSignupFlow } from "../../application/UpsertSignupFlow";
import { ErrorInvalidUserTelephone } from "~/modules/users/domain/UserTelephone";
import type { LoggerI } from "~/packages/logger/Logger";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";

export class ValidateTelephoneUpsertingSignupFlowOnTelephoneValueChanged {
  public async handle(value: unknown, prefixValue: string): Promise<boolean | string> {
    const telephoneValue = String(value || "");

    const resultUpsertingSignupFlow = await this.upsertSignupFlow.handle({
      CPF: null,
      email: null,
      password: null,
      telephone: telephoneValue,
      telephonePrefix: prefixValue,
    });

    if (resultUpsertingSignupFlow.isFailure) {
      if (resultUpsertingSignupFlow.error instanceof ErrorInvalidUserTelephone) {
        if (resultUpsertingSignupFlow.error.reason === "telephone_empty") {
          return this.translateFunction("validation.telephone_required");
        }

        if (resultUpsertingSignupFlow.error.reason === "telephone_too_short") {
          return this.translateFunction("validation.telephone_invalid_too_short");
        }
      }
      this.logger.error("Error while upserting the signup flow with the telephone", resultUpsertingSignupFlow.error);
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
