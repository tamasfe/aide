import { CustomError } from "~/packages/result";

export class ErrorCurrencyNotRecognized extends CustomError {
  override name = "ErrorCurrencyNotRecognized" as const;

  constructor(invalidValue: string, metadata: Record<string, unknown>) {
    super("Currency not recognized", { ...metadata, invalidValue });
  }
}
