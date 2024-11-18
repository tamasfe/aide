import { CustomError } from "~/packages/result";

export class ErrorInvalidBalance extends CustomError {
  override readonly name = "ErrorInvalidBalance" as const;

  constructor(invalidValue: number, metadata: Record<string, unknown>) {
    super("Balance value is not valid", { ...metadata, invalidValue });
  }
}
