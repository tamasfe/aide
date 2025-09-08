export class UserTelephoneMask {
  public static new(countryCode: string, telephoneValue: string): UserTelephoneMask {
    return new UserTelephoneMask(countryCode, telephoneValue);
  }

  public value(): string {
    switch (this.countryCode) {
      case "BR":
      {
        const BRAZIL_MASK_MOBILE = "(##) # ####-####";
        const BRAZIL_MASK_FIXED = "(##) ####-####";

        const thirdDigitOfUnmaskedTelephone = this.telephoneValue.replace(/\D/g, "").slice(2, 3);
        const isBrazilianMobileTelephone = thirdDigitOfUnmaskedTelephone === "9";
        return isBrazilianMobileTelephone ? BRAZIL_MASK_MOBILE : BRAZIL_MASK_FIXED;
      }
      case "US":
        return "(###) ###-####";
      default:
        return "";
    }
  }

  private constructor(private readonly countryCode: string, private readonly telephoneValue: string) {
    this.countryCode = countryCode;
    this.telephoneValue = telephoneValue;
  }
}
