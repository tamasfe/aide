import countryCodeOptions from "country-calling-code";
import { CustomError, fail, success } from "~/packages/result";

/**
 * Source: https://worldpopulationreview.com/country-rankings/phone-number-length-by-country
 */
const MIN_TELEPHONE_LENGTH = 4;
const MAX_TELEPHONE_LENGTH = 15;

export class UserTelephone {
  public get value() {
    return this.prefix.value + this.telephone;
  }

  public readonly telephone: string;
  public readonly prefix: UserTelephonePrefix;

  /**
   *
   * @param telephone Telephone value without the country code prefix
   * @param prefix Country code prefix starting with a "+" sign
   * @returns
   */
  public static new(telephone: string, prefix: string) {
    try {
      return success(new UserTelephone(telephone, prefix));
    }
    catch (error) {
      if (error instanceof ErrorInvalidUserTelephone) {
        return fail(error);
      }
      throw error;
    }
  }

  /**
   *
   * @param value Telephone value with the country code prefix. Starting with a "+" sign
   * @returns
   */
  public static newFromSingleValue(value: string) {
    const valueWithoutPlus = value.replace("+", "");
    for (const countryCodeOption of countryCodeOptions) {
      for (const countryCode of countryCodeOption.countryCodes) {
        if (valueWithoutPlus.startsWith(countryCode)) {
          return UserTelephone.new(valueWithoutPlus.slice(countryCode.length), `+${countryCode}`);
        }
      }
    }

    return fail(ErrorInvalidUserTelephone.newFromUnrecognizedPrefix(value));
  }

  constructor(
    telephone: string,
    prefix: string,
  ) {
    const cleanTelephoneValue = telephone.replace(/[^\d-]/g, "");
    if (!cleanTelephoneValue) {
      throw ErrorInvalidUserTelephone.newFromMissingTelephone(telephone);
    }
    if (cleanTelephoneValue.length > MAX_TELEPHONE_LENGTH) {
      throw ErrorInvalidUserTelephone.newFromTelephoneTooLong(telephone, MAX_TELEPHONE_LENGTH);
    }
    if (cleanTelephoneValue.length < MIN_TELEPHONE_LENGTH) {
      throw ErrorInvalidUserTelephone.newFromTelephoneTooShort(telephone, MIN_TELEPHONE_LENGTH);
    }
    this.telephone = cleanTelephoneValue;

    if (!prefix) {
      throw ErrorInvalidUserTelephone.newFromEmptyPrefix(prefix);
    }

    if (!prefix.startsWith("+")) {
      throw ErrorInvalidUserTelephone.newFromMissingPlusInPrefix(prefix);
    }

    const prefixWithoutPlus = prefix.replace("+", "");

    let recognizedPrefix: null | UserTelephonePrefix = null;
    for (const countryCodeOption of countryCodeOptions) {
      if (countryCodeOption.countryCodes.includes(prefixWithoutPlus)) {
        recognizedPrefix = {
          value: prefix,
          countryCode: countryCodeOption.isoCode2,
        };
        continue;
      }
    }
    if (!recognizedPrefix) {
      throw ErrorInvalidUserTelephone.newFromInvalidPrefix(prefix);
    }
    this.prefix = recognizedPrefix;
  }
}

type ErrorInvalidUserTelephoneReason = "telephone_empty" | "telephone_too_long" | "telephone_too_short" | "prefix_empty" | "prefix_invalid" | "prefix_missing_plus_sign" | "prefix_unrecognized";

export class ErrorInvalidUserTelephone extends CustomError {
  override name = "ErrorInvalidUserTelephone" as const;
  public readonly reason: ErrorInvalidUserTelephoneReason;

  public static newFromMissingTelephone(telephone: string) {
    return new ErrorInvalidUserTelephone("The telephone value is mandatory", "telephone_empty", { telephone });
  }

  public static newFromEmptyPrefix(prefix: string) {
    return new ErrorInvalidUserTelephone("The telephone prefix is mandatory", "prefix_empty", { prefix });
  }

  public static newFromInvalidPrefix(prefix: string) {
    return new ErrorInvalidUserTelephone("Invalid prefix, should appear in the allowed prefix options", "prefix_invalid", { prefix });
  }

  public static newFromMissingPlusInPrefix(prefix: string) {
    return new ErrorInvalidUserTelephone("Invalid prefix, it should start with '+'", "prefix_missing_plus_sign", { prefix });
  }

  public static newFromUnrecognizedPrefix(value: string) {
    return new ErrorInvalidUserTelephone("Could not recognize a valid prefix from the telephone value", "prefix_unrecognized", { value });
  }

  public static newFromTelephoneTooLong(telephone: string, maxLength: number) {
    return new ErrorInvalidUserTelephone("The telephone number length is too long", "telephone_too_long", { telephone, maxLength });
  }

  public static newFromTelephoneTooShort(telephone: string, minLength: number) {
    return new ErrorInvalidUserTelephone("The telephone number length is too short", "telephone_too_short", { telephone, minLength });
  }

  private constructor(message: string, reason: ErrorInvalidUserTelephoneReason, metadata: Record<string, unknown> = {}) {
    super(message, metadata);
    this.reason = reason;
  }
}

export type UserTelephonePrefix = {
  /**
   * With the + sign at the beginning
   */
  value: string;

  /**
   * Iso code 2 of the country
   */
  countryCode: string;

};
