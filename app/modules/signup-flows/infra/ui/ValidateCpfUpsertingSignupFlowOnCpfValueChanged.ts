import type { UpsertSignupFlow } from "../../application/UpsertSignupFlow";
import type { LoggerI } from "~/packages/logger/Logger";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";

export class ValidateCpfUpsertingSignupFlowOnCpfValueChanged {
  public async handle(value: unknown): Promise<boolean | string> {
    const cpfValue = String(value);

    if (!value || !cpfValue) {
      return this.translateFunction("validation.cpf_required");
    }

    const resultUpsertingSignupFlow = await this.upsertSignupFlow.handle({
      CPF: cpfValue,
      email: null,
      password: null,
      telephone: null,
    });

    if (resultUpsertingSignupFlow.isFailure) {
      if (resultUpsertingSignupFlow.error.name === "InvalidCPF") {
        return this.translateFunction("validation.cpf_invalid");
      }

      this.logger.error("Error while upserting the signup flow with the cpf", { error: resultUpsertingSignupFlow.error });
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
