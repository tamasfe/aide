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

        const cleanTelephone = this.telephoneValue.replace(/\D/g, "");

        const thirdDigitOfUnmaskedTelephone = cleanTelephone.slice(2, 3);
        if (!thirdDigitOfUnmaskedTelephone) {
          // Makes it easier and more fluid to paste or auto-fill a brazilian telephone number (longer). If the user wants to paste or autofill a landline one, being shorter it also works good.
          return BRAZIL_MASK_MOBILE;
        }

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
