import { it, describe, expect } from "vitest";

describe("moneyMask", () => {
  it("returns empty string and undefined number when input is empty", () => {
    const result = moneyMask("", "en-US");
    expect(result.value).toBe("");
    expect(result.number).toBeUndefined();
  });

  it("removes non-numeric characters and formats correctly", () => {
    const result = moneyMask("1234.56", "de-DE");
    expect(result.value).toBe("1.234,56");
    expect(result.number).toBeCloseTo(1234.56);
  });

  it("handles decimal separator correctly", () => {
    const result = moneyMask("1.234,56", "de-DE");
    expect(result.value).toBe("1.234,56");
    expect(result.number).toBeCloseTo(1234.56);
  });

  it("handles thousands separator correctly", () => {
    const result = moneyMask("1,234,567.89", "en-US");
    expect(result.value).toBe("1,234,567.89");
    expect(result.number).toBeCloseTo(1234567.89);
  });

  it("handles different locales correctly", () => {
    const result1 = moneyMask("1234.56", "fr-FR");
    // looks like intl is using a different space character
    expect(result1.value).toBe("1\u202f234,56");
    expect(result1.number).toBeCloseTo(1234.56);

    const result2 = moneyMask("1234.56", "ja-JP");
    expect(result2.value).toBe("1,234.56");
    expect(result2.number).toBeCloseTo(1234.56);
  });

  it("handles very large numbers correctly", () => {
    const result = moneyMask("1234567890.12", "en-US");
    expect(result.value).toBe("1,234,567,890.12");
    expect(result.number).toBeCloseTo(1234567890.12);
  });

  it("handles very small numbers correctly", () => {
    const result = moneyMask("0.0012", "en-US");
    expect(result.value).toBe("0.12");
    expect(result.number).toBeCloseTo(0.12);
  });

  it("converts different decimal separators to the one used in the locale", () => {
    const result1 = moneyMask("1.234,56", "en-US");
    expect(result1.value).toBe("1,234.56");
    expect(result1.number).toBeCloseTo(1234.56);

    const result2 = moneyMask("1,234.56", "de-DE");
    expect(result2.value).toBe("1.234,56");
    expect(result2.number).toBeCloseTo(1234.56);
  });
});
