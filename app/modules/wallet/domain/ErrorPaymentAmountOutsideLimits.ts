import { CustomError } from "~/packages/result";

export class ErrorPaymentAmountOutsideLimits extends CustomError {
  override name = "ErrorPaymentAmountOutsideLimits" as const;

  public static new(limitExceeded: "min" | "max", amountExceeded: number, metadata: Record<string, unknown>) {
    return new ErrorPaymentAmountOutsideLimits(limitExceeded, amountExceeded, metadata);
  }

  private constructor(
    public readonly limitExceeded: "min" | "max",
    public readonly amountLimit: number,
    metadata: Record<string, unknown>,
  ) {
    super("The payment amount is below the minimum, or above the maximum, the user wallet allowes", metadata);
  }
}
