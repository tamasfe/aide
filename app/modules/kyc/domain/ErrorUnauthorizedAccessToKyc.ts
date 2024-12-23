import { CustomError } from "~/packages/result";

export class ErrorUnauthorizedAccessToKyc extends CustomError {
  override name = "ErrorUnauthorizedAccessToKyc" as const;

  public static new(metadata: Record<string, unknown> = {}) {
    return new ErrorUnauthorizedAccessToKyc(metadata);
  }

  private constructor(metadata: Record<string, unknown> = {}) {
    super("Unauthorized access to KYC", metadata);
  }
}
