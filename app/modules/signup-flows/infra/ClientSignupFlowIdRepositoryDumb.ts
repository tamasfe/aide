import type { SignupFlowIdNotFound } from "../domain/errors/SignupFlowIdNotFound";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import { success, type Result } from "~/packages/result";

export class ClientSignupFlowIdRepositoryDumb
implements SignupFlowIdClientRepositoryI {
  public async findCurrent(): Promise<Result<string, SignupFlowIdNotFound>> {
    console.debug("DumbClientSignupFlowIdRepository.findCurrent called");
    return success("1");
  }

  public async searchCurrent() {
    console.debug("DumbClientSignupFlowIdRepository.searchCurrentFlowId called");
    return success("1");
  }

  public async saveCurrent(flowId: string) {
    console.debug("DumbClientSignupFlowIdRepository.saveCurrent called with flowId: ", flowId);
    return success();
  }
}
