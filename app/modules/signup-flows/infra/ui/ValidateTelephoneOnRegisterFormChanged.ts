import type { ValidateUserTelephone } from "~/modules/users/application/ValidateUserTelephone";
import { UserTelephoneMask, type UserTelephoneMaskSupportedCountryCode } from "~/modules/users/infra/ui/UserTelephoneMask";
import type { TranslateFunctionType } from "~/packages/translation";

export class ValidateTelephoneOnRegisterFormChanged {
  public async handle(value: unknown, prefixValue: string, prefixCountryCode: UserTelephoneMaskSupportedCountryCode): Promise<boolean | string> {
    const telephoneValue = String(value || "");

    const mask = UserTelephoneMask.new(prefixCountryCode, telephoneValue).value();
    if (telephoneValue.length < mask.length) {
      return this.translateFunction("validation.telephone_invalid_too_short", { num: String(mask.length - telephoneValue.length) });
    }
    if (telephoneValue.length > mask.length) {
      return this.translateFunction("validation.telephone_invalid_too_long", { num: String(telephoneValue.length - mask.length) });
    }

    const resultValidating = await this.validateUserTelephone.handle(telephoneValue, prefixValue);
    if (!resultValidating.isFailure) {
      return true;
    }

    return this.translateFunction("validation.telephone_invalid");
  }

  constructor(
    private validateUserTelephone: ValidateUserTelephone,
    private translateFunction: TranslateFunctionType,
  ) {
  }
}
