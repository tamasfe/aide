import { CustomError } from "~/packages/result";

export class ErrorInvalidPasswordRecoveryToken extends CustomError {
  override name = "ErrorInvalidPasswordRecoveryToken" as const;

  public static new(token: string) {
    return new ErrorInvalidPasswordRecoveryToken({ token });
  }

  constructor(metadata: Record<string, unknown>) {
    super("Invalid authentication credentials", metadata);
  }
}
