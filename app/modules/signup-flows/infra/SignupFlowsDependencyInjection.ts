import type { PublicRuntimeConfig } from "nuxt/schema";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import { UpsertSignupFlow } from "../application/UpsertSignupFlow";
import { CreateSignupFlow } from "../application/CreateSignupFlow";
import { SearchCurrentSignupFlow } from "../application/SearchCurrentSignupFlow";
import { DeleteCurrentSignupFlowId } from "../application/DeleteCurrentSignupFlowId";
import { SignupFlowIdClientRepositoryDumb } from "./SignupFlowIdClientRepositoryDumb";
import { SignupFlowApiRepositoryDumb } from "./SignupFlowApiRepositoryDumb";
import { SubmitSignupFlowOnFormSubmission } from "./ui/SubmitSignupFlowOnFormSubmission";
import { SignupFlowIdClientRepositoryLocalStorage } from "./SignupFlowIdClientRepositoryLocalStorage";
import { SignupFlowApiRepositoryGirobet } from "./SignupFlowApiRepositoryGirobet";
import { UserTimeZoneRetrieverIntl } from "./UserTimeZoneRetrieverIntl";
import { UserLanguageRetrieverQuery } from "./UserLanguageRetrieverQuery";
import { ValidateEmailOnRegisterFormChanged } from "./ui/ValidateEmailOnRegisterFormChanged";
import { ValidateCpfOnRegisterFormChanged } from "./ui/ValidateCpfOnRegisterFormChanged";
import { ValidatePasswordOnRegisterFormChanged } from "./ui/ValidatePasswordOnRegisterFormChanged";
import { ValidateTelephoneOnRegisterFormChanged } from "./ui/ValidateTelephoneOnRegisterFormChanged";
import { SearchCurrentSignupFlowOnModalInit } from "./ui/SearchCurrentSignupFlowOnModal";
import { DeleteCurrentSignupFlowIdOnSignupFlowSubmitted } from "./ui/DeleteCurrentSignupFlowIdOnSignupFlowSubmitted";
import { UpsertSignupFlowOnRegisterFormInputChange } from "./ui/UpsertSignupFlowOnRegisterFormInputChange";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";
import { ValidateUserCpf } from "~/modules/users/application/ValidateUserCpf";
import { ValidateUserPassword } from "~/modules/users/application/ValidateUserPassword";
import { ValidateUserTelephone } from "~/modules/users/application/ValidateUserTelephone";
import { ValidateUserEmail } from "~/modules/users/application/ValidateUserEmail";
import { StartSignupFlowOnInitAnonymousUser } from "./ui/StartSignupFlowOnInitAnonymousUser";

export interface SignupFlowsDependencyInjectionI {
  signupFlowApiRepository: SignupFlowApiRepositoryI;
  clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI;
  ui: {
    deleteCurrentSignupFlowIdOnSignupFlowSubmitted: DeleteCurrentSignupFlowIdOnSignupFlowSubmitted;
    searchCurrentSignupFlowOnModalInit: SearchCurrentSignupFlowOnModalInit;
    startSignupFlowOnInitAnonymousUser: StartSignupFlowOnInitAnonymousUser;
    submitSignupFlowOnFormSubmission: SubmitSignupFlowOnFormSubmission;
    upsertSignupFlowOnRegisterFormInputChange: UpsertSignupFlowOnRegisterFormInputChange;
    validateEmailOnRegisterFormChanged: ValidateEmailOnRegisterFormChanged;
    validateCpfOnRegisterFormChanged: ValidateCpfOnRegisterFormChanged;
    validatePasswordOnRegisterFormChanged: ValidatePasswordOnRegisterFormChanged;
    validateTelephoneOnRegisterFormChanged: ValidateTelephoneOnRegisterFormChanged;
  };
}

export const createSignupFlowsDependencyInjection = (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI): SignupFlowsDependencyInjectionI => {
  const apiBaseUrl = useCasinoApiOrigin("api");
  const mode = publicConfig.signupFlows.apiMode;

  const signupFlowApiRepository: SignupFlowApiRepositoryI = (() => {
    if (mode === "dumb") {
      return new SignupFlowApiRepositoryDumb();
    }

    return new SignupFlowApiRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
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
    new UserLanguageRetrieverQuery(commonDependencies.i18n.queries.findLocaleForUser),
  );

  return {
    signupFlowApiRepository,
    clientSignupFlowIdRepository,

    ui: {
      startSignupFlowOnInitAnonymousUser: new StartSignupFlowOnInitAnonymousUser(
        new CreateSignupFlow(signupFlowApiRepository, clientSignupFlowIdRepository),
        clientSignupFlowIdRepository,
        signupFlowApiRepository,
        commonDependencies.logger,
      ),
      deleteCurrentSignupFlowIdOnSignupFlowSubmitted: new DeleteCurrentSignupFlowIdOnSignupFlowSubmitted(
        new DeleteCurrentSignupFlowId(clientSignupFlowIdRepository),
        commonDependencies.logger,
      ),
      searchCurrentSignupFlowOnModalInit: new SearchCurrentSignupFlowOnModalInit(
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
      upsertSignupFlowOnRegisterFormInputChange: new UpsertSignupFlowOnRegisterFormInputChange(
        upsertSignupFlow,
        commonDependencies.logger,
      ),
      validateEmailOnRegisterFormChanged: new ValidateEmailOnRegisterFormChanged(
        new ValidateUserEmail(),
        commonDependencies.translateFunction,
      ),
      validateCpfOnRegisterFormChanged: new ValidateCpfOnRegisterFormChanged(
        new ValidateUserCpf(),
        commonDependencies.translateFunction,
      ),
      validatePasswordOnRegisterFormChanged: new ValidatePasswordOnRegisterFormChanged(
        new ValidateUserPassword(),
        commonDependencies.translateFunction,
      ),
      validateTelephoneOnRegisterFormChanged: new ValidateTelephoneOnRegisterFormChanged(
        new ValidateUserTelephone(),
        commonDependencies.translateFunction,
      ),
    },
  };
};
