import type { UpsertSignupFlow, UpsertSignupFlowPayload } from "../../application/UpsertSignupFlow";
import type { LoggerI } from "~/packages/logger/Logger";

export class UpsertSignupFlowOnRegisterFormInputChange {
  constructor(
    private upsertSignupFlow: UpsertSignupFlow,
    private logger: LoggerI,
  ) {}

  public async handle(payload: UpsertSignupFlowPayload) {
    const resultUpsertingSignupFlow = await this.upsertSignupFlow.handle(payload);

    if (resultUpsertingSignupFlow.isFailure) {
      this.logger.error("Error while upserting the signup flow", resultUpsertingSignupFlow.error);
    }

    return;
  }
}
