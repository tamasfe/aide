import type { PublicRuntimeConfig } from "nuxt/schema";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import { SignupFlowIdClientRepositoryDumb } from "./SignupFlowIdClientRepositoryDumb";
import { SignupFlowApiRepositoryDumb } from "./SignupFlowApiRepositoryDumb";
import { SubmitSignupFlowOnFormSubmission } from "./ui/SubmitSignupFlowOnFormSubmission";
import { SignupFlowIdClientRepositoryLocalStorage } from "./SignupFlowIdClientRepositoryLocalStorage";
import { SignupFlowApiRepositoryGirobet } from "./SignupFlowApiRepositoryGirobet";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface SignupFlowsDependencyInjectionI {
  signupFlowApiRepository: SignupFlowApiRepositoryI;
  clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI;
  ui: {
    submitSignupFlowOnFormSubmission: SubmitSignupFlowOnFormSubmission;
  };
}

export const createSignupFlowsDependencyInjection = (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, requestHeaders?: Record<string, string>): SignupFlowsDependencyInjectionI => {
  const signupFlowApiRepository: SignupFlowApiRepositoryI = (() => {
    if (!publicConfig.signupFlows.apiBaseUrl) {
      return new SignupFlowApiRepositoryDumb();
    }

    return new SignupFlowApiRepositoryGirobet({ baseUrl: publicConfig.signupFlows.apiBaseUrl, headers: requestHeaders, userJurisdiction: publicConfig.signupFlows.apiClientFixedUserJurisdiction }, commonDependencies.asyncMessagePublisher);
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

  return {
    signupFlowApiRepository,
    clientSignupFlowIdRepository,

    ui: {
      submitSignupFlowOnFormSubmission: new SubmitSignupFlowOnFormSubmission(
        clientSignupFlowIdRepository,
        signupFlowApiRepository,
        commonDependencies.asyncMessagePublisher,
      ),
    },
  };
};
