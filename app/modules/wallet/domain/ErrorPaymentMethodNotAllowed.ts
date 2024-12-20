import { CustomError } from "~/packages/result";

export class ErrorPaymentMethodNotAllowed extends CustomError {
  public override name = "ErrorPaymentMethodNotAllowed" as const;

  public static new(paymentMethodId: number, metadata: Record<string, unknown>) {
    return new ErrorPaymentMethodNotAllowed({ ...metadata, paymentMethodId });
  }

  constructor(metadata: Record<string, unknown> = {}) {
    super("Payment method not allowed", metadata);
  }
}
