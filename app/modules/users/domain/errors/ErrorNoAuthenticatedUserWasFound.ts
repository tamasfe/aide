import { CustomError } from "~/packages/result";

export class ErrorNoAuthenticatedUserWasFound extends CustomError {
  override name = "ErrorNoAuthenticatedUserWasFound" as const;
}
