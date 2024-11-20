import type { RecoverPassword } from "../../application/RecoverPassword";
import { UserPassword } from "../../domain/UserPassword";
import type { TranslateFunctionType } from "~/packages/translation";

export class RecoverPasswordOnForm {
  constructor(
    private command: RecoverPassword,
    private t: TranslateFunctionType,
  ) {}

  public async handle(newPassword: string, token: string | null): Promise<string | null> {
    if (!token) {
      return this.t("recover_password.error_invalid_token");
    }

    const newPasswordResult = UserPassword.new(newPassword);
    if (newPasswordResult.isFailure) {
      switch (newPasswordResult.error.reason) {
        case "too_long":
          return this.t("validation.password_invalid_too_long", { max: String(UserPassword.MAX_PASSWORD_LENGTH) });
        case "too_short":
          return this.t("validation.password_invalid_too_short", { min: String(UserPassword.MIN_PASSWORD_LENGTH) });
      }
    }

    const result = await this.command.handle(newPassword, token);
    if (result.isFailure) {
      if (result.error.name === "ErrorInvalidPasswordRecoveryToken") {
        return this.t("recover_password.error_invalid_token");
      }
      return this.t("recover_password.error_unknown");
    }

    return null;
  }
}
