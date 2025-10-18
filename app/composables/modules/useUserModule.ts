import { SearchAuthenticatedUser } from "~/modules/users/application/SearchAuthenticatedUser";
import type { AuthenticatedUserRepositoryI } from "~/modules/users/domain/AuthenticatedUserRepository";
import type { AuthenticationRepositoryI } from "~/modules/users/domain/AuthenticationRepository";
import { LoginUser } from "~/modules/users/application/LoginUser";
import { LogoutUser } from "~/modules/users/application/LogoutUser";
import { RecoverPassword } from "~/modules/users/application/RecoverPassword";
import { UpdateUserSettings } from "~/modules/users/application/UpdateUserSettings";
import { SearchUserSettingsSimplified } from "~/modules/users/application/SearchUserSettingsSimplified";
import { UpdateUserSettingsChangedConsents } from "~/modules/users/application/UpdateUserSettingsChangedConsents";
import { CloseAccount } from "~/modules/users/application/CloseAccount";
import { AuthenticatedUserRepositoryDumb } from "~/modules/users/infra/AuthenticatedUserRepositoryDumb";
import { EmitCommandOpenUserActionModalModal } from "~/modules/users/infra/ui/EmitCommandOpenUserActionModal";
import { PromoUserActionActivityLocalStorage } from "~/modules/users/infra/PromoUserActionActivityLocalStorage";
import { OpenUserPromoActionModalOncePerDay } from "~/modules/users/infra/ui/OpenUserPromoActionModalOncePerDay";
import { AuthenticatedUserSearcherGirobet } from "~/modules/users/infra/AuthenticatedUserRepositoryGirobet";
import { AuthenticationRepositoryDumb } from "~/modules/users/infra/AuthenticationRepositoryDumb";
import { AuthenticationRepositoryGirobet } from "~/modules/users/infra/AuthenticationRepositoryGirobet";
import { AttemptUserLoginOnFormSubmission } from "~/modules/users/infra/ui/AttemptUserLoginOnFormSubmission";
import { LogoutCurrentUserFromButtonClick } from "~/modules/users/infra/ui/LogoutCurrentUserFromButtonClick";
import { EmitCommandCloseUserActionModal } from "~/modules/users/infra/ui/EmitCommandCloseUserActionModal";
import { RecoverPasswordOnForm } from "~/modules/users/infra/ui/RecoverPasswordOnForm";
import { RequestRecoverPasswordOnForm } from "~/modules/users/infra/ui/RequestRecoverPasswordOnForm";
import { UpdateUserLocaleOnLocaleSelect } from "~/modules/users/infra/ui/user-settings/UpdateUserLocaleOnLocaleSelect";
import { UpdateConsentsOnPreferencesPage } from "~/modules/users/infra/ui/user-settings/UpdateConsentsOnPreferencesPage";
import { UpdateSettingsOnForm } from "~/modules/users/infra/ui/user-settings/UpdateSettingsOnForm";
import { CloseAccountOnForm } from "~/modules/users/infra/ui/CloseAccountOnForm";
import { UpdateUsernameOnFormSubmission } from "~/modules/users/infra/ui/UpdateUsernameOnFormSubmission";

export default function () {
  const runtimeConfig = useRuntimeConfig();
  const { $apiClient } = useNuxtApp();
  const logger = useLogger();
  const nuxtApp = useNuxtApp();

  const authenticatedUserRepo: AuthenticatedUserRepositoryI = (() => {
    switch (runtimeConfig.public.users?.apiMode) {
      case "mock":
        return new AuthenticatedUserRepositoryDumb(logger);
      default:
        return new AuthenticatedUserSearcherGirobet($apiClient);
    }
  })();

  const authenticationRepo: AuthenticationRepositoryI = (() => {
    switch (runtimeConfig.public.users?.apiMode) {
      case "mock":
        return new AuthenticationRepositoryDumb(logger);
      default:
        return new AuthenticationRepositoryGirobet($apiClient, logger);
    }
  })();

  const updateUserSettingsCommand = new UpdateUserSettings(authenticatedUserRepo, nuxtApp);

  const emitCommandOpenUserActionModal = new EmitCommandOpenUserActionModalModal(nuxtApp);
  const promoUserActionActivityLocalStorage = new PromoUserActionActivityLocalStorage();
  const openUserPromoActionModalOncePerDay = new OpenUserPromoActionModalOncePerDay(
    promoUserActionActivityLocalStorage,
    emitCommandOpenUserActionModal,
    logger,
  );

  return {
    queries: {
      searchAuthenticatedUser: new SearchAuthenticatedUser(authenticatedUserRepo, logger),
      searchUserSettingsSimplified: new SearchUserSettingsSimplified(authenticatedUserRepo),
    },
    ui: {
      userSettings: {
        updateLocaleOnLocaleSelect: new UpdateUserLocaleOnLocaleSelect(
          updateUserSettingsCommand,
          logger,
        ),
        updateConsentsOnPreferencesPage: new UpdateConsentsOnPreferencesPage(
          new UpdateUserSettingsChangedConsents(authenticatedUserRepo, nuxtApp),
          logger,
          nuxtApp.$i18n.t,
        ),
        updateSettingsOnForm: new UpdateSettingsOnForm(
          updateUserSettingsCommand,
          logger,
          nuxtApp.$i18n.t,
          nuxtApp,
        ),
        updateUsernameOnForm: new UpdateUsernameOnFormSubmission(
          updateUserSettingsCommand,
          nuxtApp.$i18n.t,
          nuxtApp,
          logger,
        ),
      },
      attemptUserLoginOnFormSubmission: new AttemptUserLoginOnFormSubmission(
        new LoginUser(authenticationRepo, nuxtApp),
        nuxtApp.$i18n.t,
        logger,
        nuxtApp,
      ),
      closeAccountOnForm: new CloseAccountOnForm(
        new CloseAccount(authenticatedUserRepo, nuxtApp),
        logger,
        nuxtApp,
        nuxtApp.$i18n.t,
      ),
      emitCommandOpenUserActionModal,
      emitCommandCloseUserActionModal: new EmitCommandCloseUserActionModal(nuxtApp),
      logoutCurrentUserFromButtonClick: new LogoutCurrentUserFromButtonClick(
        new LogoutUser(authenticationRepo, nuxtApp),
        logger,
      ),
      recoverPassword: new RecoverPasswordOnForm(
        new RecoverPassword(authenticationRepo, nuxtApp),
        nuxtApp.$i18n.t,
      ),
      requestRecoverPasswordOnForm: new RequestRecoverPasswordOnForm(
        authenticationRepo,
        nuxtApp,
        logger,
        nuxtApp.$i18n.t,
      ),
      openUserPromoActionModalOncePerDay,
    },
  };
}
