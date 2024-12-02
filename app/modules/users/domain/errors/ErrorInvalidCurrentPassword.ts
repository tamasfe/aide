import { CustomError } from "~/packages/result";

export class ErrorInvalidCurrentPassword extends CustomError {
  override name = "ErrorInvalidCurrentPassword" as const;

  constructor() {
    super("Invalid current password");
  }
}
