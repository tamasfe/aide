import { UpsertSignupFlow } from "../../application/UpsertSignupFlow";
import type { SignupFlowsDependencyInjectionI } from "../SignupFlowsDependencyInjection";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";

export class ValidateTelephoneUpsertingSignupFlowOnTelephoneValueChanged {
  public async handle(value: unknown): Promise<boolean | string> {
    const telephoneValue = String(value);

    if (!telephoneValue) {
      return this.translateFunction("modal_session.telephone_required");
    }

    const resultUpsertingSignupFlow = await this.upsertSignupFlow.handle({
      CPF: null,
      email: null,
      password: null,
      telephone: telephoneValue,
    });

    if (resultUpsertingSignupFlow.isFailure) {
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
