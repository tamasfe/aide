import type { PublicRuntimeConfig } from "nuxt/schema";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import { SignupFlowIdClientRepositoryDumb } from "./SignupFlowIdClientRepositoryDumb";
import { SignupFlowApiRepositoryDumb } from "./SignupFlowApiRepositoryDumb";
import { SubmitSignupFlowOnFormSubmission } from "./ui/SubmitSignupFlowOnFormSubmission";
import { SignupFlowIdClientRepositoryLocalStorage } from "./SignupFlowIdClientRepositoryLocalStorage";
import { SignupFlowApiRepositoryGirobet } from "./SignupFlowApiRepositoryGirobet";

export interface SignupFlowsDependencyInjectionI {
  signupFlowApiRepository: SignupFlowApiRepositoryI;
  clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI;
  ui: {
    submitSignupFlowOnFormSubmission: SubmitSignupFlowOnFormSubmission;
  };
}

export const createSignupFlowsDependencyInjection = (publicConfig: PublicRuntimeConfig): SignupFlowsDependencyInjectionI => {
  const signupFlowApiRepository: SignupFlowApiRepositoryI = (() => {
    if (!publicConfig.signupFlows.apiBaseUrl) {
      return new SignupFlowApiRepositoryDumb();
    }

    return new SignupFlowApiRepositoryGirobet(publicConfig.signupFlows.apiBaseUrl, publicConfig.signupFlows.apiClientFixedUserJurisdiction);
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
      ),
    },
  };
};
