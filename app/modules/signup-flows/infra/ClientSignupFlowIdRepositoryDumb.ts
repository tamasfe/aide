import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import { success } from "~/packages/result";

export class ClientSignupFlowIdRepositoryDumb
implements SignupFlowIdClientRepositoryI {
  public async searchCurrent() {
    console.debug("DumbClientSignupFlowIdRepository.searchCurrentFlowId called");
    return success("1");
  }

  public async saveCurrent(flowId: string) {
    console.debug("DumbClientSignupFlowIdRepository.saveCurrent called with flowId: ", flowId);
    return success();
  }
}
