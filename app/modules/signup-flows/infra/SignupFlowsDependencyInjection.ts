import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import { ClientSignupFlowIdRepositoryDumb } from "./ClientSignupFlowIdRepositoryDumb";
import { SignupFlowApiRepositoryDumb } from "./SignupFlowApiRepositoryDumb";
import { SubmitSignupFlowOnFormSubmission } from "./ui/SubmitSignupFlowOnFormSubmission";

export interface SignupFlowsDependencyInjectionI {
  signupFlowApiRepository: SignupFlowApiRepositoryI;
  clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI;
  ui: {
    submitSignupFlowOnFormSubmission: SubmitSignupFlowOnFormSubmission;
  };
}

export const createSignupFlowsDependencyInjection = (): SignupFlowsDependencyInjectionI => {
  const signupFlowApiRepository: SignupFlowApiRepositoryI = new SignupFlowApiRepositoryDumb();
  const clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI = new ClientSignupFlowIdRepositoryDumb();
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
