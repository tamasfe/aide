import type { SignupFlow } from "../domain/SignupFlow";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import { UserCPF } from "~/modules/users/domain/UserCPF";
import { UserEmail } from "~/modules/users/domain/UserEmail";
import type { CustomError, Result } from "~/packages/result";
import { success } from "~/packages/result";

export class UpsertSignupFlow {
  constructor(
    private readonly clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI,
    private readonly signupFlowApiRepositoryI: SignupFlowApiRepositoryI,
  ) {}

  public async handle(signupFlowPayload: {
    email: null | string;
    password: null | string;
    phone: null | string;
    CPF: null | string;
  }) {
    const userEmailResult = signupFlowPayload.email
      ? UserEmail.new(signupFlowPayload.email)
      : success(null);
    if (userEmailResult.isFailure) {
      return userEmailResult;
    }

    const userCPFResult = signupFlowPayload.CPF
      ? UserCPF.new(signupFlowPayload.CPF)
      : success(null);
    if (userCPFResult.isFailure) {
      return userCPFResult;
    }

    const currentSignupFlowIdResult
      = await this.clientSignupFlowIdRepository.searchCurrentFlowId();
    if (currentSignupFlowIdResult.isFailure) {
      return currentSignupFlowIdResult;
    }

    const currentSignupFlowResult = await this.createOrGetSignupFlow(
      currentSignupFlowIdResult.value,
    );
    if (currentSignupFlowResult.isFailure) {
      return currentSignupFlowResult;
    }

    let updatedSignupFlow = currentSignupFlowResult.value;

    if (userCPFResult.value) {
      const updatedSignupFlowResult = updatedSignupFlow.newUpdatingCpf(
        userCPFResult.value,
      );
      if (updatedSignupFlowResult.isFailure) {
        return updatedSignupFlowResult;
      }
      updatedSignupFlow = updatedSignupFlowResult.value;
    }

    if (!updatedSignupFlow.needsPersisting) {
      return success();
    }

    return this.signupFlowApiRepositoryI.update(updatedSignupFlow);
  }

  private async createOrGetSignupFlow(
    signupFlowIdOrEmpty: string | null,
  ): Promise<Result<SignupFlow, CustomError>> {
    if (signupFlowIdOrEmpty === null) {
      return this.signupFlowApiRepositoryI.create();
    }

    const signupFlowResult
      = await this.signupFlowApiRepositoryI.getById(signupFlowIdOrEmpty);
    if (signupFlowResult.isFailure) {
      if (signupFlowResult.error.name === "SignupFlowNotFound") {
        return this.signupFlowApiRepositoryI.create();
      }
    }
    return signupFlowResult;
  }
}
