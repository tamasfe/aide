import { SubmitSignupFlow } from "../../application/SubmitSignupFlow";
import type { SignupFlowApiRepositoryI } from "../../domain/SignupFlowApiRepositoryI";
import type { SignupFlowIdClientRepositoryI } from "../../domain/SignupFlowIdClientRepositoryI";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import type { LoggerI } from "~/packages/logger/Logger";

export class SubmitSignupFlowOnFormSubmission {
  constructor(
    private flowIdClientRepository: SignupFlowIdClientRepositoryI,
    private apiRepository: SignupFlowApiRepositoryI,
    private asyncMessagePublisher: AsyncMessagePublisherI,
    private translateFunction: TranslateFunctionType,
    private logger: LoggerI,
  ) {}

  public async handle(): Promise<string | null> {
    const result = await new SubmitSignupFlow(this.flowIdClientRepository, this.apiRepository).handle();

    if (result.isFailure) {
      // TODO: Handle common API errors
      this.logger.error("Error submitting the signup flow. More info in the cause", { error: result.error });
      return this.translateFunction("modal_session.error_submitting_flow");
    }

    this.asyncMessagePublisher.emit("girobet:events:users:user-logged-in", { });
    this.asyncMessagePublisher.emit("girobet:commands:modals:close-user-interaction-modal", {});

    return null;
  }
}
