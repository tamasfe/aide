import { UpsertSignupFlow } from "../../application/UpsertSignupFlow";
import type { SignupFlowsDependencyInjectionI } from "../SignupFlowsDependencyInjection";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";

export class ValidatePasswordUpsertingSignupFlowOnPasswordValueChanged {
  public async handle(value: unknown): Promise<boolean | string> {
    const passwordValue = String(value).trim();

    if (!passwordValue) {
      return this.translateFunction("modal_session.password_required");
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
              return this.translateFunction("modal_session.password_invalid_too_long");
            case "too_short":
              return this.translateFunction("modal_session.password_invalid_too_short");
          }
        })();
      }
      return resultUpsertingSignupFlow.error.message;
    }

    return true;
  }

  private upsertSignupFlow: UpsertSignupFlow;

  constructor(
    dependencies: SignupFlowsDependencyInjectionI,
    private translateFunction: TranslateFunctionType,
  ) {
    this.upsertSignupFlow = new UpsertSignupFlow(
      dependencies.clientSignupFlowIdRepository,
      dependencies.signupFlowApiRepository,
    );
  }
}
