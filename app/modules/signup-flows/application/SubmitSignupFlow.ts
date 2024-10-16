import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import { success } from "~/packages/result";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class SubmitSignupFlow {
  constructor(
    private flowIdClientRepository: SignupFlowIdClientRepositoryI,
    private apiRepository: SignupFlowApiRepositoryI,
    private asyncMessagePublisher: AsyncMessagePublisherI,
  ) {

  }

  public async handle() {
    const flowIdResult = await this.flowIdClientRepository.findCurrent();
    if (flowIdResult.isFailure) {
      return flowIdResult;
    }

    const flowId = flowIdResult.value;

    const result = await this.apiRepository.submit(flowId);
    if (result.isFailure) {
      return result;
    }

    this.asyncMessagePublisher.emit("girobet:events:users:user-logged-in", { });

    return success();
  }
}
