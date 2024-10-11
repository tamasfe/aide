import type { PublicRuntimeConfig } from "nuxt/schema";
import { SearchAuthenticatedUser } from "../application/SearchAuthenticatedUser";
import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";
import { LoginUser } from "../application/LoginUser";
import { AuthenticatedUserRepositoryDumb } from "./AuthenticatedUserRepositoryDumb";
import { EmitCommandOpenLoginModal } from "./ui/EmitCommandOpenLoginModal";
import { AuthenticatedUserSearcherGirobet } from "./AuthenticatedUserRepositoryGirobet";
import { AuthenticationRepositoryDumb } from "./AuthenticationRepositoryDumb";
import { AuthenticationRepositoryGirobet } from "./AuthenticationRepositoryGirobet";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface UsersDependencyInjectionI {
  queries: {
    searchAuthenticatedUser: SearchAuthenticatedUser;
    loginUser: LoginUser;
  };
  ui: {
    emitCommandOpenLoginModal: EmitCommandOpenLoginModal;
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
      loginUser: new LoginUser(authenticationRepo),
    },
    ui: {
      emitCommandOpenLoginModal: new EmitCommandOpenLoginModal(commonDependencies.asyncMessagePublisher),
    },
  };
};
