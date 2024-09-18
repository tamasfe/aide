import { CustomError, fail, success, type Result } from "~/packages/result";

export class UserPassword {
  public static MIN_PASSWORD_LENGTH = 6;
  public static MAX_PASSWORD_LENGTH = 255;

  public static new(value: string): Result<UserPassword, InvalidUserPassword> {
    try {
      return success(new UserPassword(value));
    }
    catch (error) {
      if (error instanceof InvalidUserPassword) {
        return fail(error);
      }
      throw error;
    }
  }

  constructor(public readonly value: string) {
    if (value.length < UserPassword.MIN_PASSWORD_LENGTH) {
      throw new InvalidUserPassword(
        value,
        "too_short",
      );
    }

    if (value.length > UserPassword.MAX_PASSWORD_LENGTH) {
      throw new InvalidUserPassword(
        value,
        "too_long",
      );
    }
  }
}

export class InvalidUserPassword extends CustomError {
  public override name = "InvalidUserPassword" as const;

  constructor(attemptedValue: string, public readonly reason: "too_long" | "too_short") {
    super("Invalid user password value", { attemptedValue, reason });
  }
}
