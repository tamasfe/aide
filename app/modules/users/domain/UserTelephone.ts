import { codes as countryCodeOptions } from "country-calling-code";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import { CustomError, fail, success } from "~/packages/result";

export const DEFAULT_PREFIX = { value: "+55", countryCode: "BR" };

export class UserTelephone {
  public get value() {
    return this.prefix.value + this.telephone;
  }

  public readonly telephone: string;
  public readonly prefix: UserTelephonePrefix;

  /**
 * Source: https://worldpopulationreview.com/country-rankings/phone-number-length-by-country
 */
  public static MIN_TELEPHONE_LENGTH = 4;
  public static MAX_TELEPHONE_LENGTH = 15;

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

  /**
   *
   * @param value Telephone value with the country code prefix. Starting with a "+" sign
   * @returns
   */
  public static newFromBackend(phoneNumber: components["schemas"]["PhoneNumber"]) {
    if (phoneNumber.code.source !== "plus") {
      return fail(ErrorInvalidUserTelephone.newFromUnrecognizedPrefixFormat(phoneNumber.code.source, String(phoneNumber.code.value)));
    }

    return UserTelephone.new(String(phoneNumber.national.value), `+${phoneNumber.code.value}`);
  }

  public toJSON(): { telephone: string; prefix: string } {
    return {
      telephone: this.telephone,
      prefix: this.prefix.value,
    };
  }

  constructor(
    telephone: string,
    prefix: string,
  ) {
    const cleanTelephoneValue = telephone.replace(/\D/g, "");
    if (!cleanTelephoneValue) {
      throw ErrorInvalidUserTelephone.newFromMissingTelephone(telephone);
    }
    if (cleanTelephoneValue.length > UserTelephone.MAX_TELEPHONE_LENGTH) {
      throw ErrorInvalidUserTelephone.newFromTelephoneTooLong(cleanTelephoneValue, UserTelephone.MAX_TELEPHONE_LENGTH);
    }
    if (cleanTelephoneValue.length < UserTelephone.MIN_TELEPHONE_LENGTH) {
      throw ErrorInvalidUserTelephone.newFromTelephoneTooShort(cleanTelephoneValue, UserTelephone.MIN_TELEPHONE_LENGTH);
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

    // Country specific rules
    if (this.prefix.countryCode === "BR") {
      const thirdDigit = cleanTelephoneValue[2];
      const isBrazilianMobileTelephone = thirdDigit === "9";

      if (isBrazilianMobileTelephone) {
        const EXACT_BRAZILIAN_MOBILE_LENGTH = 11;
        if (cleanTelephoneValue.length > EXACT_BRAZILIAN_MOBILE_LENGTH) {
          throw ErrorInvalidUserTelephone.newFromTelephoneTooLong(cleanTelephoneValue, EXACT_BRAZILIAN_MOBILE_LENGTH);
        }
        if (cleanTelephoneValue.length < EXACT_BRAZILIAN_MOBILE_LENGTH) {
          throw ErrorInvalidUserTelephone.newFromTelephoneTooShort(cleanTelephoneValue, EXACT_BRAZILIAN_MOBILE_LENGTH);
        }
      }
      if (!isBrazilianMobileTelephone) {
        const EXACT_BRAZILIAN_LANDLINE_LENGTH = 10;
        if (cleanTelephoneValue.length > EXACT_BRAZILIAN_LANDLINE_LENGTH) {
          throw ErrorInvalidUserTelephone.newFromTelephoneTooLong(cleanTelephoneValue, EXACT_BRAZILIAN_LANDLINE_LENGTH);
        }
        if (cleanTelephoneValue.length < EXACT_BRAZILIAN_LANDLINE_LENGTH) {
          throw ErrorInvalidUserTelephone.newFromTelephoneTooShort(cleanTelephoneValue, EXACT_BRAZILIAN_LANDLINE_LENGTH);
        }
      }
    }
  }
}

export class ErrorInvalidUserTelephone extends CustomError {
  override name = "ErrorInvalidUserTelephone" as const;
  public readonly reason: {
    value: "telephone_empty" | "prefix_empty" | "prefix_invalid" | "prefix_missing_plus_sign" | "prefix_unrecognized";
  } | {
    value: "telephone_too_long";
    max: number;
    diff: number;
  } | {
    value: "telephone_too_short";
    min: number;
    diff: number;
  };

  public static newFromMissingTelephone(telephone: string) {
    return new ErrorInvalidUserTelephone("The telephone value is mandatory", { value: "telephone_empty" }, { telephone });
  }

  public static newFromEmptyPrefix(prefix: string) {
    return new ErrorInvalidUserTelephone("The telephone prefix is mandatory", { value: "prefix_empty" }, { prefix });
  }

  public static newFromInvalidPrefix(prefix: string) {
    return new ErrorInvalidUserTelephone("Invalid prefix, should appear in the allowed prefix options", { value: "prefix_invalid" }, { prefix });
  }

  public static newFromMissingPlusInPrefix(prefix: string) {
    return new ErrorInvalidUserTelephone("Invalid prefix, it should start with '+'", { value: "prefix_missing_plus_sign" }, { prefix });
  }

  public static newFromUnrecognizedPrefix(value: string) {
    return new ErrorInvalidUserTelephone("Could not recognize a valid prefix from the telephone value", { value: "prefix_unrecognized" }, { value });
  }

  public static newFromUnrecognizedPrefixFormat(prefixSource: string, prefixValue: string) {
    return new ErrorInvalidUserTelephone("Could not recognize a prefix format. Expected it to be a plus ('+')", { value: "prefix_unrecognized" }, { prefixSource, prefixValue });
  }

  public static newFromTelephoneTooLong(telephone: string, maxLength: number) {
    return new ErrorInvalidUserTelephone("The telephone number length is too long", { value: "telephone_too_long", max: maxLength, diff: Math.abs(telephone.length - maxLength) }, { telephone });
  }

  public static newFromTelephoneTooShort(telephone: string, minLength: number) {
    return new ErrorInvalidUserTelephone("The telephone number length is too short", { value: "telephone_too_short", min: minLength, diff: Math.abs(telephone.length - minLength) }, { telephone });
  }

  private constructor(message: string, reason: ErrorInvalidUserTelephone["reason"], metadata: Record<string, unknown> = {}) {
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
