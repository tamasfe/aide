import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { UserLanguageRetrieverI } from "../domain/UserLanguageRetriever";
import type { UserTimeZoneRetrieverI } from "../domain/UserTimeZoneRetriever";
import { UserTelephone } from "~/modules/users/domain/UserTelephone";
import { UserCPF } from "~/modules/users/domain/UserCPF";
import { UserEmail } from "~/modules/users/domain/UserEmail";
import { UserPassword } from "~/modules/users/domain/UserPassword";
import { success } from "~/packages/result";

type Payload = {
  email: string | null;
  password: string | null;
  telephone: string | null;
  telephonePrefix: string | null;
  CPF: string | null;
  utmParameters: Record<string, string> | null;
};
export class UpsertSignupFlow {
  constructor(
    private readonly clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI,
    private readonly signupFlowApiRepositoryI: SignupFlowApiRepositoryI,
    private readonly userTimeZoneRetriever: UserTimeZoneRetrieverI,
    private readonly userLanguageRetriever: UserLanguageRetrieverI,
  ) {}

  public async handle(signupFlowPayload: Payload) {
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

    const userTelephoneResult = signupFlowPayload.telephone !== null && signupFlowPayload.telephonePrefix !== null
      ? UserTelephone.new(signupFlowPayload.telephone, signupFlowPayload.telephonePrefix)
      : success(null);
    if (userTelephoneResult.isFailure) {
      return userTelephoneResult;
    }

    const currentSignupFlowIdResult
      = await this.clientSignupFlowIdRepository.searchCurrent();
    if (currentSignupFlowIdResult.isFailure) {
      return currentSignupFlowIdResult;
    }

    const currentSignupFlowResult = await this.getCurrentSignupFlowOrCreateNew(
      currentSignupFlowIdResult.value,
    );
    if (currentSignupFlowResult.isFailure) {
      return currentSignupFlowResult;
    }

    const errorSavingCurrentFlowIdResult = await this.clientSignupFlowIdRepository.saveCurrent(currentSignupFlowResult.value.id);
    if (errorSavingCurrentFlowIdResult.isFailure) {
      return errorSavingCurrentFlowIdResult;
    }

    const userLocaleResult = await this.userLanguageRetriever.search();
    if (userLocaleResult.isFailure) {
      return userLocaleResult;
    }

    const userTimeZoneResult = await this.userTimeZoneRetriever.search();
    if (userTimeZoneResult.isFailure) {
      return userTimeZoneResult;
    }

    const updatedSignupFlowResult = currentSignupFlowResult.value.newUpdatingProps(
      {
        email: userEmailResult.value?.value,
        cpf: userCPFResult.value?.value,
        password: userPasswordResult.value?.value,
        telephone: userTelephoneResult.value?.value,
        locale: userLocaleResult.value,
        timeZone: userTimeZoneResult.value,
        utmParameters: signupFlowPayload.utmParameters,
      },
    );

    if (updatedSignupFlowResult.isFailure) {
      return updatedSignupFlowResult;
    }

    return this.signupFlowApiRepositoryI.update(updatedSignupFlowResult.value);
  }

  private async getCurrentSignupFlowOrCreateNew(
    signupFlowIdOrEmpty: string | null,
  ) {
    if (signupFlowIdOrEmpty === null) {
      const signupFlowIdResult = await this.signupFlowApiRepositoryI.create();
      if (signupFlowIdResult.isFailure) {
        return signupFlowIdResult;
      }
      return this.signupFlowApiRepositoryI.getById(signupFlowIdResult.value);
    }

    const signupFlowResult
      = await this.signupFlowApiRepositoryI.getById(signupFlowIdOrEmpty);
    if (signupFlowResult.isFailure) {
      if (signupFlowResult.error.name === "SignupFlowNotFound") {
        const signupFlowIdResult = await this.signupFlowApiRepositoryI.create();
        if (signupFlowIdResult.isFailure) {
          return signupFlowIdResult;
        }
        return this.signupFlowApiRepositoryI.getById(signupFlowIdResult.value);
      }
    }
    return signupFlowResult;
  }
}
