import { CustomError } from "~/packages/result";

export class ErrorPaymentMethodNotFound extends CustomError {
  override name = "ErrorPaymentMethodNotFound" as const;

  public static new(metadata: Record<string, unknown>) {
    return new ErrorPaymentMethodNotFound(metadata);
  }

  private constructor(metadata: Record<string, unknown>) {
    super("Payment method not found", metadata);
  }
}
