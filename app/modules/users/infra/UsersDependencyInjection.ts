import type { PublicRuntimeConfig } from "nuxt/schema";
import { SearchAuthenticatedUser } from "../application/SearchAuthenticatedUser";
import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";
import { LoginUser } from "../application/LoginUser";
import { LogoutUser } from "../application/LogoutUser";
import { AuthenticatedUserRepositoryDumb } from "./AuthenticatedUserRepositoryDumb";
import { EmitCommandOpenUserActionModalModal } from "./ui/EmitCommandOpenUserActionModal";
import { AuthenticatedUserSearcherGirobet } from "./AuthenticatedUserRepositoryGirobet";
import { AuthenticationRepositoryDumb } from "./AuthenticationRepositoryDumb";
import { AuthenticationRepositoryGirobet } from "./AuthenticationRepositoryGirobet";
import { AttemptUserLoginOnFormSubmission } from "./ui/AttemptUserLoginOnFormSubmission";
import { LogoutCurrentUserFromButtonClick } from "./ui/LogoutCurrentUserFromButtonClick";
import { EmitCommandCloseUserActionModal } from "./ui/EmitCommandCloseUserActionModal";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface UsersDependencyInjectionI {
  queries: {
    searchAuthenticatedUser: SearchAuthenticatedUser;
  };
  ui: {
    emitCommandOpenUserActionModal: EmitCommandOpenUserActionModalModal;
    emitCommandCloseUserActionModal: EmitCommandCloseUserActionModal;
    attemptUserLoginOnFormSubmission: AttemptUserLoginOnFormSubmission;
    logoutCurrentUserFromButtonClick: LogoutCurrentUserFromButtonClick;
  };
}
export const createUsersDependencyInjection = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, requestHeaders?: Record<string, string>): Promise<UsersDependencyInjectionI> => {
  const isServer = import.meta.server;
  const authenticatedRepositoryBaseUrl = isServer ? config.users.authenticatedRepositoryBaseUrlServer : config.users.authenticatedRepositoryBaseUrlClient;

  const authenticatedUserRepo: AuthenticatedUserRepositoryI = (() => {
    if (authenticatedRepositoryBaseUrl) {
      return new AuthenticatedUserSearcherGirobet({ baseUrl: authenticatedRepositoryBaseUrl, userJurisdiction: config.genericFixedUserJurisdiction, headers: requestHeaders }, commonDependencies.asyncMessagePublisher);
    }
    return new AuthenticatedUserRepositoryDumb(commonDependencies.logger);
  })();

  const authenticationRepo: AuthenticationRepositoryI = (() => {
    if (authenticatedRepositoryBaseUrl) {
      return new AuthenticationRepositoryGirobet({ baseUrl: authenticatedRepositoryBaseUrl, userJurisdiction: config.genericFixedUserJurisdiction, headers: requestHeaders }, commonDependencies.asyncMessagePublisher, commonDependencies.logger);
    }
    return new AuthenticationRepositoryDumb(commonDependencies.logger);
  })();

  return {
    queries: {
      searchAuthenticatedUser: new SearchAuthenticatedUser(authenticatedUserRepo),
    },
    ui: {
      emitCommandOpenUserActionModal: new EmitCommandOpenUserActionModalModal(commonDependencies.asyncMessagePublisher),
      emitCommandCloseUserActionModal: new EmitCommandCloseUserActionModal(commonDependencies.asyncMessagePublisher),
      attemptUserLoginOnFormSubmission: new AttemptUserLoginOnFormSubmission(
        new LoginUser(authenticationRepo, commonDependencies.asyncMessagePublisher),
        commonDependencies.translateFunction,
        commonDependencies.logger,
        commonDependencies.asyncMessagePublisher,
      ),
      logoutCurrentUserFromButtonClick: new LogoutCurrentUserFromButtonClick(
        new LogoutUser(authenticationRepo, commonDependencies.asyncMessagePublisher),
        commonDependencies.logger,
      ),
    },
  };
};
