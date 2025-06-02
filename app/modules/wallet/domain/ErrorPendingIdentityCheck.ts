import { CustomError } from "~/packages/result";

export class ErrorPendingIdentityCheck extends CustomError {
  override name = "ErrorPendingIdentityCheck" as const;

  constructor() {
    super("The user is missing their identity / KYC check", { });
  }
}
