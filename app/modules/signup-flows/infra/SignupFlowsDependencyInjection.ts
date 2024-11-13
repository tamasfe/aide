import type { PublicRuntimeConfig } from "nuxt/schema";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import { UpsertSignupFlow } from "../application/UpsertSignupFlow";
import { SearchCurrentSignupFlow } from "../application/SearchCurrentSignupFlow";
import { DeleteCurrentSignupFlowId } from "../application/DeleteCurrentSignupFlowId";
import { SignupFlowIdClientRepositoryDumb } from "./SignupFlowIdClientRepositoryDumb";
import { SignupFlowApiRepositoryDumb } from "./SignupFlowApiRepositoryDumb";
import { SubmitSignupFlowOnFormSubmission } from "./ui/SubmitSignupFlowOnFormSubmission";
import { SignupFlowIdClientRepositoryLocalStorage } from "./SignupFlowIdClientRepositoryLocalStorage";
import { SignupFlowApiRepositoryGirobet } from "./SignupFlowApiRepositoryGirobet";
import { UserTimeZoneRetrieverIntl } from "./UserTimeZoneRetrieverIntl";
import { UserLanguageRetrieverNavigator } from "./UserLanguageRetrieverNavigator";
import { ValidateEmailUpsertingSignupFlowOnEmailValueChanged } from "./ui/ValidateEmailUpsertingSignupFlowOnEmailValueChanged";
import { ValidateCpfUpsertingSignupFlowOnCpfValueChanged } from "./ui/ValidateCpfUpsertingSignupFlowOnCpfValueChanged";
import { ValidatePasswordUpsertingSignupFlowOnPasswordValueChanged } from "./ui/ValidatePasswordUpsertingSignupFlowOnPasswordValueChanged";
import { ValidateTelephoneUpsertingSignupFlowOnTelephoneValueChanged } from "./ui/ValidateTelephoneUpsertingSignupFlowOnTelephoneValueChanged";
import { SearchCurrentSignupFlowOnModal } from "./ui/SearchCurrentSignupFlowOnModal";
import { DeleteCurrentSignupFlowIdOnSignupFlowSubmitted } from "./ui/DeleteCurrentSignupFlowIdOnSignupFlowSubmitted";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface SignupFlowsDependencyInjectionI {
  signupFlowApiRepository: SignupFlowApiRepositoryI;
  clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI;
  ui: {
    deleteCurrentSignupFlowIdOnSignupFlowSubmitted: DeleteCurrentSignupFlowIdOnSignupFlowSubmitted;
    searchCurrentSignupFlowOnModal: SearchCurrentSignupFlowOnModal;
    submitSignupFlowOnFormSubmission: SubmitSignupFlowOnFormSubmission;
    validateEmailUpsertingSignupFlowOnEmailValueChanged: ValidateEmailUpsertingSignupFlowOnEmailValueChanged;
    validateCpfUpsertingSignupFlowOnCpfValueChanged: ValidateCpfUpsertingSignupFlowOnCpfValueChanged;
    validatePasswordUpsertingSignupFlowOnPasswordValueChanged: ValidatePasswordUpsertingSignupFlowOnPasswordValueChanged;
    validateTelephoneUpsertingSignupFlowOnTelephoneValueChanged: ValidateTelephoneUpsertingSignupFlowOnTelephoneValueChanged;
  };
}

export const createSignupFlowsDependencyInjection = (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, requestHeaders?: Record<string, string>): SignupFlowsDependencyInjectionI => {
  const isServer = import.meta.server;
  const apiBaseUrl = isServer ? publicConfig.signupFlows.apiBaseUrlServer : publicConfig.signupFlows.apiBaseUrlClient;

  const signupFlowApiRepository: SignupFlowApiRepositoryI = (() => {
    if (!apiBaseUrl) {
      return new SignupFlowApiRepositoryDumb();
    }

    return new SignupFlowApiRepositoryGirobet({ baseUrl: apiBaseUrl, headers: requestHeaders, userJurisdiction: publicConfig.genericFixedUserJurisdiction }, commonDependencies.asyncMessagePublisher);
  })();

  const clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI = (() => {
    switch (publicConfig.signupFlows.idsClientRepo) {
      case "local_storage":
        return new SignupFlowIdClientRepositoryLocalStorage();

      case "mock":
        return new SignupFlowIdClientRepositoryDumb();

      default:
        throw new Error("Unrecognized signup flow ids client repository type: " + publicConfig.signupFlows.idsClientRepo);
    }
  })();

  const upsertSignupFlow = new UpsertSignupFlow(
    clientSignupFlowIdRepository,
    signupFlowApiRepository,
    new UserTimeZoneRetrieverIntl(),
    new UserLanguageRetrieverNavigator(),
  );

  return {
    signupFlowApiRepository,
    clientSignupFlowIdRepository,

    ui: {
      deleteCurrentSignupFlowIdOnSignupFlowSubmitted: new DeleteCurrentSignupFlowIdOnSignupFlowSubmitted(
        new DeleteCurrentSignupFlowId(clientSignupFlowIdRepository),
        commonDependencies.logger,
      ),
      searchCurrentSignupFlowOnModal: new SearchCurrentSignupFlowOnModal(
        new SearchCurrentSignupFlow(
          clientSignupFlowIdRepository,
          signupFlowApiRepository,
        ),
        commonDependencies.logger,
      ),
      submitSignupFlowOnFormSubmission: new SubmitSignupFlowOnFormSubmission(
        clientSignupFlowIdRepository,
        signupFlowApiRepository,
        commonDependencies.asyncMessagePublisher,
        commonDependencies.translateFunction,
        commonDependencies.logger,
      ),
      validateEmailUpsertingSignupFlowOnEmailValueChanged: new ValidateEmailUpsertingSignupFlowOnEmailValueChanged(
        upsertSignupFlow,
        commonDependencies.translateFunction,
        commonDependencies.logger,
      ),
      validateCpfUpsertingSignupFlowOnCpfValueChanged: new ValidateCpfUpsertingSignupFlowOnCpfValueChanged(
        upsertSignupFlow,
        commonDependencies.translateFunction,
        commonDependencies.logger,
      ),
      validatePasswordUpsertingSignupFlowOnPasswordValueChanged: new ValidatePasswordUpsertingSignupFlowOnPasswordValueChanged(
        upsertSignupFlow,
        commonDependencies.translateFunction,
        commonDependencies.logger,
      ),
      validateTelephoneUpsertingSignupFlowOnTelephoneValueChanged: new ValidateTelephoneUpsertingSignupFlowOnTelephoneValueChanged(
        upsertSignupFlow,
        commonDependencies.translateFunction,
        commonDependencies.logger,
      ),
    },
  };
};
