import { describe, it, expect } from "vitest";
import { ErrorInvalidUserTelephone, UserTelephone } from "~/modules/users/domain/UserTelephone";

describe("UserTelephone unit tests", async () => {
  it("correctly returns its value as the combination of prefix and telephone value", () => {
    const telephoneResult = UserTelephone.new("111111111", "+55");
    if (telephoneResult.isFailure) {
      throw telephoneResult.error;
    }

    expect(telephoneResult.value.value).toBe("+55111111111");
  });

  it("does not accept a prefix without plus sign '+'", () => {
    const telephoneResult = UserTelephone.new("111111111", "55");
    if (!telephoneResult.isFailure) {
      throw new Error("Expected to fail");
    }

    expect(telephoneResult.error).toBeInstanceOf(ErrorInvalidUserTelephone);
    expect(telephoneResult.error.reason).toBe("prefix_missing_plus_sign");
  });

  describe("'newFromSingleValue' method", () => {
    const PREFIXES_TO_TRY = ["+55", "+1", "+1-829", "+506"];
    for (const prefix of PREFIXES_TO_TRY) {
      it(`correctly returns the same telephone value when passing the ${prefix} prefix`, () => {
        const phoneWithPrefix = `${prefix}111111111`;
        const telephoneResult = UserTelephone.newFromSingleValue(phoneWithPrefix);
        if (telephoneResult.isFailure) {
          throw telephoneResult.error;
        }

        expect(telephoneResult.value.value).toBe(phoneWithPrefix);
      });
    }

    it(`correctly returns the telephone for "+4917611111111"`, () => {
      const telephoneResult = UserTelephone.newFromSingleValue("+4917611111111");
      if (telephoneResult.isFailure) {
        throw telephoneResult.error;
      }

      expect(telephoneResult.value.value).toBe("+4917611111111");
      expect(telephoneResult.value.telephone).toBe("17611111111");
    });
  });
});
