import { UpsertSignupFlow } from "../../application/UpsertSignupFlow";
import type { SignupFlowsDependencyInjectionI } from "../SignupFlowsDependencyInjection";
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
    });

    if (resultUpsertingSignupFlow.isFailure) {
      // TODO: depending of the typed error: handle returning a translation key or another
      if (resultUpsertingSignupFlow.error.name === "InvalidUserEmail") {
        return this.translateFunction("validation.email_invalid");
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
