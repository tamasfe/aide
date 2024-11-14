import { UserCPF } from "../domain/UserCPF";
import { success } from "~/packages/result";

export class ValidateUserCpf {
  public async handle(cpf: string) {
    const result = UserCPF.new(cpf);
    if (result.isFailure) {
      return result;
    }
    return success();
  }
}
