import { UpsertSignupFlow } from "../../application/UpsertSignupFlow";
import type { SignupFlowsDependencyInjectionI } from "../SignupFlowsDependencyInjection";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";

export class ValidateCpfUpsertingSignupFlowOnCpfValueChanged {
  public async handle(value: unknown): Promise<boolean | string> {
    const cpfValue = String(value);

    if (!cpfValue) {
      return this.translateFunction("modal_session.cpf_required");
    }

    const resultUpsertingSignupFlow = await this.upsertSignupFlow.handle({
      CPF: cpfValue,
      email: null,
      password: null,
      phone: null,
    });

    if (resultUpsertingSignupFlow.isFailure) {
      // TODO: depending of the typed error: handle returning a translation key or another
      if (resultUpsertingSignupFlow.error.name === "InvalidCPF") {
        return this.translateFunction("modal_session.cpf_invalid");
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
