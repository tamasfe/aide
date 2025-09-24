import { CustomError } from "~/packages/result";

export class ErrorPaymentCountExceedsTimeframeLimits extends CustomError {
  public override name = "ErrorPaymentCountExceedsTimeframeLimits" as const;

  public static new(
    seconds: number,
    limitCount: number,
    metadata: Record<string, unknown>,
  ) {
    return new ErrorPaymentCountExceedsTimeframeLimits(seconds, limitCount, metadata);
  }

  private constructor(
    public readonly seconds: number,
    public readonly limitCount: number,
    metadata: Record<string, unknown>,
  ) {
    super("A user attempts to make payments exceeding a certain count in a specific timeframe - The limit may exist on a wallet or global currency level", metadata);
  }
}
