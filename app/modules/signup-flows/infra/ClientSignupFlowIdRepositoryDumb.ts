import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import { success, type CustomError, type Result } from "~/packages/result";

export class ClientSignupFlowIdRepositoryDumb
implements SignupFlowIdClientRepositoryI {
  public async searchCurrentFlowId(): Promise<
    Result<string | null, CustomError>
  > {
    console.log("DumbClientSignupFlowIdRepository.searchCurrentFlowId called");
    return success("1");
  }
}
