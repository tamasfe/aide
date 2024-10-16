import type { UpsertSignupFlow } from "../../application/UpsertSignupFlow";
import type { LoggerI } from "~/packages/logger/Logger";
import { UserPassword } from "~/modules/users/domain/UserPassword";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";

export class ValidatePasswordUpsertingSignupFlowOnPasswordValueChanged {
  public async handle(value: unknown): Promise<boolean | string> {
    const passwordValue = String(value).trim();

    if (!value || !passwordValue) {
      return this.translateFunction("validation.password_required");
    }

    const resultUpsertingSignupFlow = await this.upsertSignupFlow.handle({
      CPF: null,
      email: null,
      telephone: null,
      password: passwordValue,
    });

    if (resultUpsertingSignupFlow.isFailure) {
      if (resultUpsertingSignupFlow.error.name === "InvalidUserPassword") {
        return ((): string => {
          switch (resultUpsertingSignupFlow.error.reason) {
            case "too_long":
              return this.translateFunction("validation.password_invalid_too_long", { max: String(UserPassword.MAX_PASSWORD_LENGTH) });
            case "too_short":
              return this.translateFunction("validation.password_invalid_too_short", { min: String(UserPassword.MIN_PASSWORD_LENGTH) });
          }
        })();
      }

      this.logger.error("Error while upserting the signup flow with the password", { error: resultUpsertingSignupFlow.error });
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
