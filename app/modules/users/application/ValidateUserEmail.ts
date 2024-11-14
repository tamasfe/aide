import { UserEmail } from "../domain/UserEmail";
import { success } from "~/packages/result";

export class ValidateUserEmail {
  public async handle(cpf: string) {
    const result = UserEmail.new(cpf);
    if (result.isFailure) {
      return result;
    }
    return success();
  }
}
