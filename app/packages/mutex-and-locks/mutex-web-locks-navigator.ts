import { fail, type CustomError, type EmptyResult, type Result } from "../result";
import { InfrastructureError } from "../result/infrastructure-error";
import type { MutexI } from "./mutex";

export class MutexWebLocksNavigator implements MutexI {
  async execute<T extends Result<unknown, CustomError> | EmptyResult<CustomError>>(lockKey: string, fn: () => Promise<T>) {
    if (typeof navigator === "undefined" || typeof navigator.locks === "undefined") {
      throw new Error("Web Locks API is not supported in this browser or you are running it in the server");
    }
    return navigator.locks.request(lockKey, async (lock) => {
      try {
        return await fn();
      }
      catch (error) {
        return fail(InfrastructureError.newFromUnknownError({ lock }, error));
      }
    });
  }
}
