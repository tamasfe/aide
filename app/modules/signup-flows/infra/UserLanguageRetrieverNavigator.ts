import type { UserLanguageRetrieverI } from "../domain/UserLanguageRetriever";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";

export class UserLanguageRetrieverNavigator implements UserLanguageRetrieverI {
  public async search(): Promise<Result<string | null, InfrastructureError>> {
    // const {$i18n} = useNuxtApp()

    if (!window?.navigator) {
      const error = new Error("Navigator global not found. This code is only meant to be run in the client.");
      return fail(InfrastructureError.newFromError({}, error));
    }

    /**
     * More information: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language
     */
    return success(window.navigator.language || null);
  }
}
