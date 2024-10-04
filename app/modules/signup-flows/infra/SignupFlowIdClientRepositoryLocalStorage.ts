import { SignupFlowIdNotFound } from "../domain/errors/SignupFlowIdNotFound";
import type { SignupFlowIdClientRepositoryI } from "../domain/SignupFlowIdClientRepositoryI";
import { ErrorRetrievingSignupFlowId } from "../domain/errors/ErrorRetrievingSignupFlowId";
import { ErrorSavingSignupFlowId } from "../domain/errors/ErrorSavingSignupFlowId";
import { fail, success } from "~/packages/result";

export class SignupFlowIdClientRepositoryLocalStorage
implements SignupFlowIdClientRepositoryI {
  public async searchCurrent() {
    if (!this.isLocalStorageAvailable()) {
      return fail(
        ErrorRetrievingSignupFlowId.newFromError({}, new Error("This repo should only be run in the client side. LocalStorage is not available on server side rendering")),
      );
    }

    try {
      const signupFlowId = window.localStorage.getItem(this.STORAGE_ID_KEY);
      if (signupFlowId === null) {
        return success(null);
      }
      return success(signupFlowId);
    }
    catch (error) {
      return fail(
        ErrorRetrievingSignupFlowId.newFromUnknownError({}, error),
      );
    }
  }

  public async findCurrent() {
    const signupFlowIdResult = await this.searchCurrent();
    if (signupFlowIdResult.isFailure) {
      return signupFlowIdResult;
    }

    if (signupFlowIdResult.value === null) {
      return fail(new SignupFlowIdNotFound({}));
    }

    return signupFlowIdResult;
  }

  public async saveCurrent(flowId: string) {
    if (!this.isLocalStorageAvailable()) {
      return fail(
        ErrorSavingSignupFlowId.newFromError({}, new Error("This repo should only be run in the client side. LocalStorage is not available on server side rendering")),
      );
    }

    try {
      window.localStorage.setItem(this.STORAGE_ID_KEY, flowId);
      return success();
    }
    catch (error) {
      return fail(
        ErrorSavingSignupFlowId.newFromUnknownError({ flowId }, error),
      );
    }
  }

  private isLocalStorageAvailable() {
    return typeof window !== "undefined" && window.localStorage;
  }

  private STORAGE_ID_KEY = "girobet-signup-flow-id" as const;
}
