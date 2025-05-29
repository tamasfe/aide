import type { GetResult } from "@fingerprintjs/fingerprintjs";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { ExceptionGettingUserFingerprint } from "../domain/ExceptionGettingUserFingerprint";
import { fail, success, type Result } from "~/packages/result";

export class FingerprintService {
  public async getFingerprint(): Promise<Result<GetResult, ExceptionGettingUserFingerprint>> {
    if (!this.fingreprintPublicAgent) {
      return fail(
        new ExceptionGettingUserFingerprint({ }, new Error("FingerprintJS library not initialized yet. Call initLibrary first")),
      );
    }

    return this.fingreprintPublicAgent.get()
      .then((fingerPrint) => {
        // this.logger.debug("Returned fingerprint value", { ...fingerPrint });
        return success(fingerPrint);
      })
      .catch(error => fail(
        ExceptionGettingUserFingerprint.newFromUnknownError({ }, error),
      ));
  }

  public isInitialized(): boolean {
    return this.fingreprintPublicAgent !== undefined;
  }

  /**
   * Beware of awaiting this function, as it loads a whole library with it.
   * More information @https://github.com/fingerprintjs/fingerprintjs/blob/master/docs/api.md#webpackrollupnpmyarn
   * And more info on the PRO version @https://dev.fingerprint.com/docs/install-the-javascript-agent#configuring-the-agent
   */
  public async initLibrary() {
    const result = await FingerprintJS.load({})
      .then(agent => success(agent))
      .catch(error => fail(ExceptionGettingUserFingerprint.newFromUnknownError({ }, error)));

    if (result.isFailure) {
      return result;
    }

    this.fingreprintPublicAgent = result.value;
    return success();
  }

  private fingreprintPublicAgent: Awaited<ReturnType<typeof FingerprintJS.load>> | undefined = undefined;
}
