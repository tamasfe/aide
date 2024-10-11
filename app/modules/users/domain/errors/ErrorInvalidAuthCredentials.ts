import { CustomError } from "~/packages/result";

export class ErrorInvalidAuthCredentials extends CustomError {
  override name = "ErrorInvalidAuthCredentials" as const;

  public static new(username: string) {
    return new ErrorInvalidAuthCredentials({ username });
  }

  constructor(metadata: Record<string, unknown>) {
    super("Invalid authentication credentials", metadata);
  }
}
