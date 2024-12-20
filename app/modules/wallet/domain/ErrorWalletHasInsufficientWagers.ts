import { CustomError } from "~/packages/result";

export class ErrorWalletHasInsufficientWagers extends CustomError {
  public override name = "ErrorWalletHasInsufficientWagers" as const;

  public static new(metadata: Record<string, unknown>) {
    return new ErrorWalletHasInsufficientWagers(metadata);
  }

  private constructor(metadata: Record<string, unknown>) {
    super("Error the wallet hasn't met the minimum wagering requirements for withdrawals, user has to place more bets before withdrawing", metadata);
  }
}
