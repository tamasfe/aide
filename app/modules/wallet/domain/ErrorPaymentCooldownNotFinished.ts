import { CustomError } from "~/packages/result";

export class ErrorPaymentCooldownNotFinished extends CustomError {
  public override name = "ErrorPaymentCooldownNotFinished" as const;

  public static newFromWithdrawal(
    cooldownMinutesLeft: number,
    metadata: Record<string, unknown> = {},
  ) {
    return new ErrorPaymentCooldownNotFinished("withdrawal", cooldownMinutesLeft, metadata);
  }

  private constructor(
    public readonly payment: "deposit" | "withdrawal",
    public readonly cooldownMinutesLeft: number,
    metadata: Record<string, unknown>,
  ) {
    super("Error the wallet hasn't met the minimum wagering requirements for withdrawals, user has to place more bets before withdrawing", {
      ...metadata,
      payment,
      cooldownMinutesLeft,
    });
  }
}
