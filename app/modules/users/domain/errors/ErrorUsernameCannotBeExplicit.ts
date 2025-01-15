import { CustomError } from "~/packages/result";

export class ErrorUsernameCannotBeExplicit extends CustomError {
  public override name = "ErrorUsernameCannotBeExplicit";

  constructor(username: string) {
    super(`Error the username cannot contain explicit words`, {
      username,
    });
  }
}
