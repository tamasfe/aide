import type { ValidateUserCpf } from "~/modules/users/application/ValidateUserCpf";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";

export class ValidateCpfOnRegisterFormChanged {
  public async handle(value: unknown): Promise<boolean | string> {
    const cpfValue = String(value ?? "");

    if (!value || !cpfValue) {
      return this.translateFunction("validation.cpf_required");
    }

    const resultValidating = await this.command.handle(cpfValue);
    if (!resultValidating.isFailure) {
      return true;
    }

    switch (resultValidating.error.name) {
      case "InvalidCPF":
        return this.translateFunction("validation.cpf_invalid");
    }
  }

  constructor(
    private command: ValidateUserCpf,
    private translateFunction: TranslateFunctionType,
  ) {
  }
}
