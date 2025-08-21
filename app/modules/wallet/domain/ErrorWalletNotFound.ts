import { CustomError } from "~/packages/result";

export class ErrorWalletNotFound extends CustomError {
  override readonly name = "ErrorWalletNotFound" as const;

  constructor(metadata?: Record<string, unknown>) {
    super("No wallet was found for this user. This can happen if the user has not made any deposits or withdrawals yet.", { ...metadata });
  }
}
