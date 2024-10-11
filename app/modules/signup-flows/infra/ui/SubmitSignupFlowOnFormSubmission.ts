import { SubmitSignupFlow } from "../../application/SubmitSignupFlow";
import type { SignupFlowApiRepositoryI } from "../../domain/SignupFlowApiRepositoryI";
import type { SignupFlowIdClientRepositoryI } from "../../domain/SignupFlowIdClientRepositoryI";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class SubmitSignupFlowOnFormSubmission {
  constructor(
    private flowIdClientRepository: SignupFlowIdClientRepositoryI,
    private apiRepository: SignupFlowApiRepositoryI,
    private asyncMessagePublisher: AsyncMessagePublisherI,
  ) {}

  public async handle(): Promise<string | null> {
    console.log("SubmitSignupFlowOnFormSubmission.handle called");

    const result = await new SubmitSignupFlow(this.flowIdClientRepository, this.apiRepository).handle();

    if (result.isFailure) {
      // TODO: Handle common API errors here with translation
      return result.error.message;
    }

    this.asyncMessagePublisher.emit("girobet:events:users:user-logged-in", { });
    this.asyncMessagePublisher.emit("girobet:commands:modals:close-user-interaction-modal", {});

    return null;
  }
}
