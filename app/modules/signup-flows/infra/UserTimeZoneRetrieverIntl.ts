import type { UserTimeZoneRetrieverI } from "../domain/UserTimeZoneRetriever";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";

export class UserTimeZoneRetrieverIntl implements UserTimeZoneRetrieverI {
  public async search(): Promise<Result<string | null, InfrastructureError>> {
    if (!window?.Intl) {
      const error = new Error("Intl global not found. This code is only meant to be run in the client.");
      return fail(InfrastructureError.newFromError({}, error));
    }

    /*
    * More information: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl
    */
    const tz = window.Intl.DateTimeFormat().resolvedOptions().timeZone;
    return success(tz || null);
  }
}
