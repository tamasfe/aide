import { UserTelephone } from "../domain/UserTelephone";
import { success } from "~/packages/result";

export class ValidateUserTelephone {
  public async handle(telephone: string, prefix: string) {
    const result = UserTelephone.new(telephone, prefix);
    if (result.isFailure) {
      return result;
    }
    return success();
  }
}
