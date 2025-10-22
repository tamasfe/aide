import type { SignupFlowIdClientRepositoryI } from "~/modules/signup-flows/domain/SignupFlowIdClientRepositoryI";
import type { SignupFlowApiRepositoryI } from "~/modules/signup-flows/domain/SignupFlowApiRepositoryI";
import { UpsertSignupFlow } from "~/modules/signup-flows/application/UpsertSignupFlow";
import { CreateSignupFlow } from "~/modules/signup-flows/application/CreateSignupFlow";
import { SearchCurrentSignupFlow } from "~/modules/signup-flows/application/SearchCurrentSignupFlow";
import { DeleteCurrentSignupFlowId } from "~/modules/signup-flows/application/DeleteCurrentSignupFlowId";
import { SignupFlowIdClientRepositoryDumb } from "~/modules/signup-flows/infra/SignupFlowIdClientRepositoryDumb";
import { SignupFlowApiRepositoryDumb } from "~/modules/signup-flows/infra/SignupFlowApiRepositoryDumb";
import { SubmitSignupFlowOnFormSubmission } from "~/modules/signup-flows/infra/ui/SubmitSignupFlowOnFormSubmission";
import { SignupFlowIdClientRepositoryLocalStorage } from "~/modules/signup-flows/infra/SignupFlowIdClientRepositoryLocalStorage";
import { SignupFlowApiRepositoryGirobet } from "~/modules/signup-flows/infra/SignupFlowApiRepositoryGirobet";
import { UserTimeZoneRetrieverIntl } from "~/modules/signup-flows/infra/UserTimeZoneRetrieverIntl";
import { UserLanguageRetrieverQuery } from "~/modules/signup-flows/infra/UserLanguageRetrieverQuery";
import { ValidateEmailOnRegisterFormChanged } from "~/modules/signup-flows/infra/ui/ValidateEmailOnRegisterFormChanged";
import { ValidateCpfOnRegisterFormChanged } from "~/modules/signup-flows/infra/ui/ValidateCpfOnRegisterFormChanged";
import { ValidatePasswordOnRegisterFormChanged } from "~/modules/signup-flows/infra/ui/ValidatePasswordOnRegisterFormChanged";
import { ValidateTelephoneOnRegisterFormChanged } from "~/modules/signup-flows/infra/ui/ValidateTelephoneOnRegisterFormChanged";
import { SearchCurrentSignupFlowOnModalInit } from "~/modules/signup-flows/infra/ui/SearchCurrentSignupFlowOnModal";
import { DeleteCurrentSignupFlowIdOnSignupFlowSubmitted } from "~/modules/signup-flows/infra/ui/DeleteCurrentSignupFlowIdOnSignupFlowSubmitted";
import { UpsertSignupFlowOnRegisterFormInputChange } from "~/modules/signup-flows/infra/ui/UpsertSignupFlowOnRegisterFormInputChange";
import { ValidateUserCpf } from "~/modules/users/application/ValidateUserCpf";
import { ValidateUserPassword } from "~/modules/users/application/ValidateUserPassword";
import { ValidateUserTelephone } from "~/modules/users/application/ValidateUserTelephone";
import { ValidateUserEmail } from "~/modules/users/application/ValidateUserEmail";
import { StartSignupFlowOnInitAnonymousUser } from "~/modules/signup-flows/infra/ui/StartSignupFlowOnInitAnonymousUser";

import { LocaleSelectionRepositoryCookie } from "../../packages/translation/infra/locale-selection-repository-cookie";
import { FindLocaleForUser } from "../../packages/translation/application/FindLocaleForUser";

export default function () {
  const runtimeConfig = useRuntimeConfig();
  const { $apiClient, $i18n } = useNuxtApp();
  const logger = useLogger();
  const nuxtApp = useNuxtApp();

  const signupFlowApiRepository: SignupFlowApiRepositoryI = (() => {
    switch (runtimeConfig.public.signupFlows?.apiMode) {
      case "mock":
        return new SignupFlowApiRepositoryDumb();
      default:
        return new SignupFlowApiRepositoryGirobet($apiClient);
    }
  })();

  const clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI = (() => {
    switch (runtimeConfig.public.signupFlows?.apiMode) {
      case "mock":
        return new SignupFlowIdClientRepositoryDumb();
      default:
        return new SignupFlowIdClientRepositoryLocalStorage();
    }
  })();

  const localeSelectionRepository = new LocaleSelectionRepositoryCookie();
  const findLocaleForUser = new FindLocaleForUser(localeSelectionRepository, $i18n.getBrowserLocale);

  return {
    signupFlowApiRepository,
    clientSignupFlowIdRepository,
    ui: {
      startSignupFlowOnInitAnonymousUser: new StartSignupFlowOnInitAnonymousUser(
        new CreateSignupFlow(signupFlowApiRepository, clientSignupFlowIdRepository),
        clientSignupFlowIdRepository,
        signupFlowApiRepository,
        logger,
      ),
      deleteCurrentSignupFlowIdOnSignupFlowSubmitted: new DeleteCurrentSignupFlowIdOnSignupFlowSubmitted(
        new DeleteCurrentSignupFlowId(clientSignupFlowIdRepository),
        logger,
      ),
      searchCurrentSignupFlowOnModalInit: new SearchCurrentSignupFlowOnModalInit(
        new SearchCurrentSignupFlow(
          clientSignupFlowIdRepository,
          signupFlowApiRepository,
        ),
        logger,
      ),
      submitSignupFlowOnFormSubmission: new SubmitSignupFlowOnFormSubmission(
        clientSignupFlowIdRepository,
        signupFlowApiRepository,
        nuxtApp,
        $i18n.t,
        logger,
      ),
      upsertSignupFlowOnRegisterFormInputChange: new UpsertSignupFlowOnRegisterFormInputChange(
        new UpsertSignupFlow(
          clientSignupFlowIdRepository,
          signupFlowApiRepository,
          new UserTimeZoneRetrieverIntl(),
          new UserLanguageRetrieverQuery(findLocaleForUser),
        ),
        logger,
      ),
      validateEmailOnRegisterFormChanged: new ValidateEmailOnRegisterFormChanged(
        new ValidateUserEmail(),
        $i18n.t,
      ),
      validateCpfOnRegisterFormChanged: new ValidateCpfOnRegisterFormChanged(
        new ValidateUserCpf(),
        $i18n.t,
      ),
      validatePasswordOnRegisterFormChanged: new ValidatePasswordOnRegisterFormChanged(
        new ValidateUserPassword(),
        $i18n.t,
      ),
      validateTelephoneOnRegisterFormChanged: new ValidateTelephoneOnRegisterFormChanged(
        new ValidateUserTelephone(),
        $i18n.t,
      ),
    },
  };
}
