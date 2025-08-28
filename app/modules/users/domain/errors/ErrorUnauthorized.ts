import { CustomError } from "~/packages/result";

export class ErrorUnauthorized extends CustomError {
  override name = "ErrorUnauthorized" as const;

  constructor(action: string) {
    super(`The user is not authorized to do this action`, { action });
  }
}
