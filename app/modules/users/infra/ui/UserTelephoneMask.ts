export type UserTelephoneMaskSupportedCountryCode = "BR" | "US";

export class UserTelephoneMask {
  public static new(countryCode: UserTelephoneMaskSupportedCountryCode, telephoneValue: string): UserTelephoneMask {
    return new UserTelephoneMask(countryCode, telephoneValue);
  }

  public value(): string {
    switch (this.countryCode) {
      case "BR":
      {
        const BRASIL_MASK_MOBILE = "(##) #####-####";
        const BRASIL_MASK_FIXED = "(##) ####-####";

        const thirdDigitOfUnmaskedTelephone = this.telephoneValue.replace(/\D/g, "").slice(2, 3);
        const isBrasilianMobileTelephone = thirdDigitOfUnmaskedTelephone === "9";
        return isBrasilianMobileTelephone ? BRASIL_MASK_MOBILE : BRASIL_MASK_FIXED;
      }
      case "US":
        return "(###) ###-####";
      default:
        return "";
    }
  }

  private constructor(private readonly countryCode: UserTelephoneMaskSupportedCountryCode, private readonly telephoneValue: string) {
    this.countryCode = countryCode;
    this.telephoneValue = telephoneValue;
  }
}
