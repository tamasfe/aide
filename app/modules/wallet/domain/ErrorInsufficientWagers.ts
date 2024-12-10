import { CustomError } from "~/packages/result";

export class ErrorInsufficientWagers extends CustomError {
  public override name = "ErrorInsufficientWagers" as const;

  public static new(metadata: Record<string, unknown>) {
    return new ErrorInsufficientWagers(metadata);
  }

  private constructor(metadata: Record<string, unknown>) {
    super("Error the wallet hasn't met the minimum wagering requirements for withdrawals, user has to place more bets before withdrawing", metadata);
  }
}
