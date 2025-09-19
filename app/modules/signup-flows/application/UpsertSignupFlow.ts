import type { DeepNonNullable } from "~/types/utils";
import { SignupFlow, type SignupFlowPropsI } from "../domain/SignupFlow";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { UserLanguageRetrieverI } from "../domain/UserLanguageRetriever";
import type { UserTimeZoneRetrieverI } from "../domain/UserTimeZoneRetriever";
import { success } from "~/packages/result";

export type UpsertSignupFlowPayload = Partial<DeepNonNullable<Omit<SignupFlowPropsI, "id">>>;

export class UpsertSignupFlow {
  constructor(
    private readonly clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI,
    private readonly signupFlowApiRepositoryI: SignupFlowApiRepositoryI,
    private readonly userTimeZoneRetriever: UserTimeZoneRetrieverI,
    private readonly userLanguageRetriever: UserLanguageRetrieverI,
  ) {}

  public async handle(signupFlowPayload: UpsertSignupFlowPayload) {
    if (Object.keys(signupFlowPayload).length === 0) {
      return success();
    }

    const signupFlowIdResult = await this.getCurrentOrCreateSignupFlowId();
    if (signupFlowIdResult.isFailure) {
      return signupFlowIdResult;
    }

    const errorSavingCurrentFlowIdResult = await this.clientSignupFlowIdRepository.saveCurrent(signupFlowIdResult.value);
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

    const updatedSignupFlowResult = SignupFlow.newFromProps(
      {
        id: signupFlowIdResult.value,
        locale: userLocaleResult.value,
        timeZone: userTimeZoneResult.value,
        cpf: signupFlowPayload.cpf || null,
        email: signupFlowPayload.email || null,
        password: signupFlowPayload.password || null,
        telephone: signupFlowPayload.telephone || null,
        utmParameters: signupFlowPayload.utmParameters || null,
      },
    );

    return this.signupFlowApiRepositoryI.update(updatedSignupFlowResult);
  }

  private async getCurrentOrCreateSignupFlowId() {
    const currentSignupFlowIdResult
      = await this.clientSignupFlowIdRepository.searchCurrent();
    if (currentSignupFlowIdResult.isFailure) {
      return currentSignupFlowIdResult;
    }

    if (currentSignupFlowIdResult.value) {
      return success(currentSignupFlowIdResult.value);
    }

    const signupFlowIdResult = await this.signupFlowApiRepositoryI.create();
    return signupFlowIdResult;
  }
}
