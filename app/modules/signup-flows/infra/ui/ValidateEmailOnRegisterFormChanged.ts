import type { ValidateUserEmail } from "~/modules/users/application/ValidateUserEmail";
import type { TranslateFunctionType } from "~/packages/translation";

export class ValidateEmailOnRegisterFormChanged {
  public async handle(value: unknown): Promise<boolean | string> {
    const emailValue = String(value);

    if (!value || !emailValue) {
      return this.translateFunction("validation.email_required");
    }

    const resultValidating = await this.validateUserEmail.handle(emailValue);
    if (!resultValidating.isFailure) {
      return true;
    }

    return this.translateFunction("validation.email_invalid");
  }

  constructor(
    private validateUserEmail: ValidateUserEmail,
    private translateFunction: TranslateFunctionType,
  ) {

  }
}
