import { SubmitSignupFlow } from "../../application/SubmitSignupFlow";
import type { SignupFlowApiRepositoryI } from "../../domain/SignupFlowApiRepositoryI";
import type { SignupFlowIdClientRepositoryI } from "../../domain/SignupFlowIdClientRepositoryI";
import type { TranslateFunctionType } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";
import type { NuxtApp } from "#app";

export class SubmitSignupFlowOnFormSubmission {
  constructor(
    private flowIdClientRepository: SignupFlowIdClientRepositoryI,
    private apiRepository: SignupFlowApiRepositoryI,
    private nuxtApp: NuxtApp,
    private translateFunction: TranslateFunctionType,
    private logger: LoggerI,
  ) {}

  public async handle(): Promise<string | null> {
    const result = await new SubmitSignupFlow(this.flowIdClientRepository, this.apiRepository, this.nuxtApp).handle();

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
      if (result.error.name === "ErrorInvalidProfile") {
        return this.translateFunction("modal_session.error_submitting_flow_invalid_profile");
      }

      this.logger.error("Error submitting the signup flow. More info in the cause", result.error);
      return this.translateFunction("modal_session.error_submitting_flow");
    }

    this.nuxtApp.callHook("frontend:commands:modals:close-user-interaction-modal");

    return null;
  }
}
