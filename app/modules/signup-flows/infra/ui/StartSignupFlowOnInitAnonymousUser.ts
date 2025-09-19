import type { CreateSignupFlow } from "../../application/CreateSignupFlow";
import type { SignupFlowApiRepositoryI } from "../../domain/SignupFlowApiRepositoryI";
import type { SignupFlowIdClientRepositoryI } from "../../domain/SignupFlowIdClientRepositoryI";
import type { LoggerI } from "~/packages/logger/Logger";

export class StartSignupFlowOnInitAnonymousUser {
  constructor(
    private readonly createSignupFlow: CreateSignupFlow,
    private readonly clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI,
    private apiRepository: SignupFlowApiRepositoryI,
    private readonly logger: LoggerI,
  ) {}

  public async handle() {
    const currentIdResult = await this.clientSignupFlowIdRepository.searchCurrent();
    if (currentIdResult.isFailure) {
      this.logger.error("Unexpected error while searching the current signup flow id on unauthenticated init", currentIdResult.error);
      return;
    }

    // No flow id is present client side: we create one.
    if (!currentIdResult.value) {
      const createResult = await this.createSignupFlow.handle();
      if (createResult.isFailure) {
        this.logger.error("Unexpected error while creating signup flow on unauthenticated user init", createResult.error);
      }
      return;
    }

    const getExistingFlowResult = await this.apiRepository.getById(currentIdResult.value);

    // Flow exists: all good
    if (!getExistingFlowResult.isFailure) {
      return;
    }

    // Flow ID exists in client but not in the backend: we need to create a new one
    if (getExistingFlowResult.error.name === "SignupFlowNotFound") {
      const createResult = await this.createSignupFlow.handle();
      if (createResult.isFailure) {
        this.logger.error("Unexpected error while creating signup flow after not finding the current one on unauthenticated user init", createResult.error);
      }
      return;
    }

    this.logger.error("Unexpected error retrieving the signup flow from the Backend on unauthenticated user init", getExistingFlowResult.error);
    return;
  }
}
