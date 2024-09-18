import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import { UserCPF } from "~/modules/users/domain/UserCPF";
import { UserEmail } from "~/modules/users/domain/UserEmail";
import { UserPassword } from "~/modules/users/domain/UserPassword";
import { success } from "~/packages/result";

export class UpsertSignupFlow {
  constructor(
    private readonly clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI,
    private readonly signupFlowApiRepositoryI: SignupFlowApiRepositoryI,
  ) {}

  public async handle(signupFlowPayload: {
    email: null | string;
    password: null | string;
    telephone: null | string;
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

    const userPasswordResult = signupFlowPayload.password
      ? UserPassword.new(signupFlowPayload.password)
      : success(null);
    if (userPasswordResult.isFailure) {
      return userPasswordResult;
    }

    const currentSignupFlowIdResult
      = await this.clientSignupFlowIdRepository.searchCurrent();
    if (currentSignupFlowIdResult.isFailure) {
      return currentSignupFlowIdResult;
    }

    const currentSignupFlowResult = await this.createOrGetSignupFlow(
      currentSignupFlowIdResult.value,
    );
    if (currentSignupFlowResult.isFailure) {
      return currentSignupFlowResult;
    }

    const errorSavingCurrentFlowId = await this.clientSignupFlowIdRepository.saveCurrent(currentSignupFlowResult.value.id);
    if (errorSavingCurrentFlowId.isFailure) {
      return errorSavingCurrentFlowId;
    }

    const updatedSignupFlowResult = currentSignupFlowResult.value.newUpdatingProps(
      {
        email: signupFlowPayload.email,
        cpf: signupFlowPayload.CPF,
        password: signupFlowPayload.password,
        telephone: signupFlowPayload.telephone,
      },
    );
    if (updatedSignupFlowResult.isFailure) {
      return updatedSignupFlowResult;
    }

    if (!updatedSignupFlowResult.value.needsPersisting) {
      return success();
    }

    return this.signupFlowApiRepositoryI.update(updatedSignupFlowResult.value);
  }

  private async createOrGetSignupFlow(
    signupFlowIdOrEmpty: string | null,
  ) {
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
