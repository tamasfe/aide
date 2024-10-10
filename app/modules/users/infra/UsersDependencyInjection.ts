import { SearchAuthenticatedUser } from "../application/SearchAuthenticatedUser";
import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import { AuthenticatedUserRepositoryDumb } from "./AuthenticatedUserRepositoryDumb";
import { EmitCommandOpenLoginModal } from "./ui/EmitCommandOpenLoginModal";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface UsersDependencyInjectionI {
  queries: {
    searchAuthenticatedUser: SearchAuthenticatedUser;
  };
  ui: {
    emitCommandOpenLoginModal: EmitCommandOpenLoginModal;
  };
}
export const createUsersDependencyInjection = async (commonDependencies: CommonDependenciesI): Promise<UsersDependencyInjectionI> => {
  const authenticatedUserSearcher: AuthenticatedUserRepositoryI = new AuthenticatedUserRepositoryDumb(commonDependencies.logger);
  return {
    queries: {
      searchAuthenticatedUser: new SearchAuthenticatedUser(authenticatedUserSearcher),
    },
    ui: {
      emitCommandOpenLoginModal: new EmitCommandOpenLoginModal(commonDependencies.asyncMessagePublisher),
    },
  };
};
