import { CustomError } from "~/packages/result";

export class ErrorUpdatingSignupFlow extends CustomError {
  override name = "ErrorUpdatingSignupFlow" as const;
}
