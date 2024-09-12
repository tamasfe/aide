import { CustomError, fail, success, type Result } from "~/packages/result";

const emailRegex = new RegExp(
  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
);

export class UserEmail {
  public static new(value: string): Result<UserEmail, InvalidUserEmail> {
    try {
      return success(new UserEmail(value));
    }
    catch (error) {
      if (error instanceof InvalidUserEmail) {
        return fail(error);
      }
      throw error;
    }
  }

  constructor(public readonly value: string) {
    if (!emailRegex.test(value)) {
      throw new InvalidUserEmail(value, "The email format is not valid");
    }
  }
}

export class InvalidUserEmail extends CustomError {
  public override name = "InvalidUserEmail" as const;

  constructor(attemptedValue: string, reason: string) {
    super("Invalid user email value", { attemptedValue, reason });
  }
}
