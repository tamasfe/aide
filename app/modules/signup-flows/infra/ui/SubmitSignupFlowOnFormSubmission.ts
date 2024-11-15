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
    const result = await new SubmitSignupFlow(this.flowIdClientRepository, this.apiRepository, this.asyncMessagePublisher).handle();

    if (result.isFailure) {
      if (result.error.name === "ErrorAlreadyTakenCpf") {
        return this.translateFunction("modal_session.error_submitting_flow_already_taken_cpf");
      }
      if (result.error.name === "ErrorAlreadyTakenEmail") {
        return this.translateFunction("modal_session.error_submitting_flow_already_taken_email");
      }
      if (result.error.name === "ErrorAlreadyTakenTelephone") {
        return this.translateFunction("modal_session.error_submitting_flow_already_taken_telephone");
      }

      this.logger.error("Error submitting the signup flow. More info in the cause", result.error);
      return this.translateFunction("modal_session.error_submitting_flow");
    }

    this.asyncMessagePublisher.emit("girobet:commands:modals:close-user-interaction-modal", {});

    return null;
  }
}
