import type { ValidateUserTelephone } from "~/modules/users/application/ValidateUserTelephone";
import type { TranslateFunctionType } from "~/packages/translation";

export class ValidateTelephoneOnRegisterFormChanged {
  public async handle(value: unknown, prefixValue: string | undefined, prefixCountryCode: string | undefined): Promise<true | string> {
    const telephoneValue = String(value || "");

    if (!prefixValue || !prefixCountryCode) {
      return this.translateFunction("validation.telephone_prefix_required");
    }

    const resultValidating = await this.validateUserTelephone.handle(telephoneValue, prefixValue);
    if (!resultValidating.isFailure) {
      return true;
    }

    if (resultValidating.error.name === "ErrorInvalidUserTelephone") {
      if (resultValidating.error.reason.value === "telephone_too_long") {
        console.log({ err: resultValidating.error }, "Invalid telephone too long");
        return this.translateFunction("validation.telephone_invalid_too_long", { num: String(resultValidating.error.reason.diff) });
      }

      if (resultValidating.error.reason.value === "telephone_too_short") {
        console.log({ err: resultValidating.error }, "Invalid telephone too short");
        return this.translateFunction("validation.telephone_invalid_too_short", { num: String(resultValidating.error.reason.diff) });
      }

      if (resultValidating.error.reason.value === "telephone_empty") {
        return this.translateFunction("validation.telephone_required");
      }
    }

    return this.translateFunction("validation.telephone_invalid");
  }

  constructor(
    private validateUserTelephone: ValidateUserTelephone,
    private translateFunction: TranslateFunctionType,
  ) {
  }
}
