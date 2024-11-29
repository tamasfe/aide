import { CustomError } from "~/packages/result";

export class ErrorPendingPaymentFlow extends CustomError {
  override name = "ErrorPendingPaymentFlow" as const;

  constructor(public readonly pendingPaymentType: "deposit" | "withdrawal") {
    super("There is a pending payment flow", { pendingPaymentType });
  }
}
