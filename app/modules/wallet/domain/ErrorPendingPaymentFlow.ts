import { CustomError } from "~/packages/result";

export class ErrorPendingPaymentFlow extends CustomError {
  override name = "ErrorPendingPaymentFlow" as const;

  constructor(public readonly pendingPaymentType: "withdrawal") {
    super("There is a pending payment flow", { pendingPaymentType });
  }
}
