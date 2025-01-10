import { CustomError } from "~/packages/result";

export class ErrorUsernameIsTaken extends CustomError {
  public override name = "ErrorUsernameIsTaken";

  constructor(username: string) {
    super(`Error the attempted username is already taken`, {
      username,
    });
  }
}
