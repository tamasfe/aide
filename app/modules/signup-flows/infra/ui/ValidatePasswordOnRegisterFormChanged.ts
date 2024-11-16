import { UserPassword } from "~/modules/users/domain/UserPassword";
import type { TranslateFunctionType } from "~/packages/translation";
import type { ValidateUserPassword } from "~/modules/users/application/ValidateUserPassword";

export class ValidatePasswordOnRegisterFormChanged {
  public async handle(value: unknown): Promise<boolean | string> {
    const passwordValue = String(value).trim();

    if (!value || !passwordValue) {
      return this.translateFunction("validation.password_required");
    }

    const resultValidating = await this.validateUserPassword.handle(passwordValue);
    if (!resultValidating.isFailure) {
      return true;
    }

    switch (resultValidating.error.reason) {
      case "too_long":
        return this.translateFunction("validation.password_invalid_too_long", { max: String(UserPassword.MAX_PASSWORD_LENGTH) });
      case "too_short":
        return this.translateFunction("validation.password_invalid_too_short", { min: String(UserPassword.MIN_PASSWORD_LENGTH) });
    }
  }

  constructor(
    private validateUserPassword: ValidateUserPassword,
    private translateFunction: TranslateFunctionType,
  ) {
  }
}
