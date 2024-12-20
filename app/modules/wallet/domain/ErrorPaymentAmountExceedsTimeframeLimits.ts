import { CustomError } from "~/packages/result";

export class ErrorPaymentAmountExceedsTimeframeLimits extends CustomError {
  public override name = "ErrorPaymentAmountExceedsTimeframeLimits" as const;

  public static new(
    days: number,
    limitAmount: number,
    metadata: Record<string, unknown>,
  ) {
    return new ErrorPaymentAmountExceedsTimeframeLimits(days, limitAmount, metadata);
  }

  private constructor(
    public readonly days: number,
    public readonly limitAmount: number,
    metadata: Record<string, unknown>,
  ) {
    super("A user attempts to make payments exceeding a certain amount in a specific timeframe - The limit may exist on a wallet or global currency level", metadata);
  }
}
