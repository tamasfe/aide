import { CustomError } from "~/packages/result";

export class ErrorWalletPaymentCooldownNotFinished extends CustomError {
  public override name = "ErrorWalletPaymentCooldownNotFinished" as const;

  public static new(
    cooldownSecondsLeft: number,
    metadata: Record<string, unknown> = {},
  ) {
    return new ErrorWalletPaymentCooldownNotFinished(
      cooldownSecondsLeft,
      { ...metadata },
    );
  }

  private constructor(public readonly cooldownSecondsLeft: number, metadata: Record<string, unknown>) {
    super("A user attempts to make multiple withdrawals within a short time frame - The cooldown period (usually 24 hours) hasn't elapsed since the last withdrawal", {
      metadata,
    });
  }
}
