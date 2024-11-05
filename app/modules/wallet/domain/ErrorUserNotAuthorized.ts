import { CustomError } from "~/packages/result";

export class ErrorUserNotAuthorized extends CustomError {
  override readonly name = "ErrorUserNotAuthorized" as const;

  constructor(metadata: Record<string, unknown>) {
    super("User is not authorized to see their wallet", { ...metadata });
  }
}
