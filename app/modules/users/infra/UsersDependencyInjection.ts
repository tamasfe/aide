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
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface UsersDependencyInjectionI {
  queries: {
    searchAuthenticatedUser: SearchAuthenticatedUser;
  };
  ui: {
    emitCommandOpenUserActionModal: EmitCommandOpenUserActionModalModal;
    attemptUserLoginOnFormSubmission: AttemptUserLoginOnFormSubmission;
    logoutCurrentUserFromButtonClick: LogoutCurrentUserFromButtonClick;
  };
}
export const createUsersDependencyInjection = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, requestHeaders?: Record<string, string>): Promise<UsersDependencyInjectionI> => {
  const authenticatedUserRepo: AuthenticatedUserRepositoryI = ((repoBaseUrl: string) => {
    if (repoBaseUrl) {
      return new AuthenticatedUserSearcherGirobet({ baseUrl: repoBaseUrl, userJurisdiction: config.genericFixedUserJurisdiction, headers: requestHeaders }, commonDependencies.asyncMessagePublisher);
    }
    return new AuthenticatedUserRepositoryDumb(commonDependencies.logger);
  })(config.users.authenticatedRepositoryBaseUrl);

  const authenticationRepo: AuthenticationRepositoryI = ((repoBaseUrl: string) => {
    if (repoBaseUrl) {
      return new AuthenticationRepositoryGirobet({ baseUrl: repoBaseUrl, userJurisdiction: config.genericFixedUserJurisdiction, headers: requestHeaders }, commonDependencies.asyncMessagePublisher);
    }
    return new AuthenticationRepositoryDumb(commonDependencies.logger);
  })(config.users.authenticatedRepositoryBaseUrl);

  return {
    queries: {
      searchAuthenticatedUser: new SearchAuthenticatedUser(authenticatedUserRepo),
    },
    ui: {
      emitCommandOpenUserActionModal: new EmitCommandOpenUserActionModalModal(commonDependencies.asyncMessagePublisher),
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
