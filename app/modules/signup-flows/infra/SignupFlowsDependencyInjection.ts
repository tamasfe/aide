import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import { ClientSignupFlowIdRepositoryDumb } from "./ClientSignupFlowIdRepositoryDumb";
import { SignupFlowApiRepositoryDumb } from "./SignupFlowApiRepositoryDumb";

export interface SignupFlowsDependencyInjectionI {
  signupFlowApiRepository: SignupFlowApiRepositoryI;
  clientSignupFlowIdRepository: SignupFlowIdClientRepositoryI;
}

export const createSignupFlowsDependencyInjection = () => {
  return {
    signupFlowApiRepository: new SignupFlowApiRepositoryDumb(),
    clientSignupFlowIdRepository: new ClientSignupFlowIdRepositoryDumb(),
  };
};
