import { UserPassword } from "../domain/UserPassword";
import { success } from "~/packages/result";

export class ValidateUserPassword {
  public async handle(password: string) {
    const result = UserPassword.new(password);
    if (result.isFailure) {
      return result;
    }
    return success();
  }
}
