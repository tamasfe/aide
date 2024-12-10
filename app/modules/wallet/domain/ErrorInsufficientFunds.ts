import { CustomError } from "~/packages/result";

export class ErrorInsufficientFunds extends CustomError {
  public override name = "ErrorInsufficientFunds" as const;

  public static new(metadata: Record<string, unknown>) {
    return new ErrorInsufficientFunds(metadata);
  }

  private constructor(metadata: Record<string, unknown>) {
    super("Error attempting to withdraw more than the available wallet balance", metadata);
  }
}
