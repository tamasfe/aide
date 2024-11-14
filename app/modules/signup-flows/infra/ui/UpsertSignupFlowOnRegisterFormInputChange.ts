import type { UpsertSignupFlow } from "../../application/UpsertSignupFlow";
import type { LoggerI } from "~/packages/logger/Logger";

export class UpsertSignupFlowOnRegisterFormInputChange {
  constructor(
    private upsertSignupFlow: UpsertSignupFlow,
    private logger: LoggerI,
  ) {}

  public async handle(payload: {
    email?: string;
    password?: string;
    telephone?: string;
    telephonePrefix?: string;
    CPF?: string;
  }) {
    const resultUpsertingSignupFlow = await this.upsertSignupFlow.handle({
      CPF: payload.CPF ?? null,
      email: payload.email ?? null,
      password: payload.password ?? null,
      telephone: payload.telephone ?? null,
      telephonePrefix: payload.telephonePrefix ?? null,
    });

    if (resultUpsertingSignupFlow.isFailure) {
      if (resultUpsertingSignupFlow.error.name === "ErrorInvalidUserTelephone" || resultUpsertingSignupFlow.error.name === "InvalidCPF" || resultUpsertingSignupFlow.error.name === "InvalidUserEmail" || resultUpsertingSignupFlow.error.name === "InvalidUserPassword") {
        return;
      }
      this.logger.error("Error while upserting the signup flow", resultUpsertingSignupFlow.error);
    }

    return;
  }
}
