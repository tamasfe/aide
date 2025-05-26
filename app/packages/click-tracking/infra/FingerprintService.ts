import type { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { load as loadFingerprintAgent } from "@fingerprintjs/fingerprintjs-pro";
import { ExceptionGettingUserFingerprint } from "../domain/ExceptionGettingUserFingerprint";
import type { LoggerI } from "~/packages/logger/Logger";
import { fail, success, type Result } from "~/packages/result";

// This is a public key so no need to obfuscate it, but we could move it to an env variable in the future if needed
const FINGERPRINT_JS_PUBLIC_API_KEY = "SsQ1phX9xutSdbMWd5AS";

export class FingerprintService {
  constructor(private logger: LoggerI) {}

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
   * More info @https://dev.fingerprint.com/docs/install-the-javascript-agent#configuring-the-agent
   */
  public async initLibrary() {
    const result = await loadFingerprintAgent({
      apiKey: FINGERPRINT_JS_PUBLIC_API_KEY,
      region: "us",
      // endpoint: [
      // // "https://metrics.yourwebsite.com",
      //   FingerprintJS.defaultEndpoint,
      // ],
      // scriptUrlPattern: [
      // // "https://metrics.yourwebsite.com/web/v<version>/<apiKey>/loader_v<loaderVersion>.js",
      //   FingerprintJS.defaultScriptUrlPattern,
      // ],
    })
      .then(agent => success(agent))
      .catch(error => fail(ExceptionGettingUserFingerprint.newFromUnknownError({ }, error)));

    if (result.isFailure) {
      return result;
    }

    this.fingreprintPublicAgent = result.value;
    return success();
  }

  private fingreprintPublicAgent: Awaited<ReturnType<typeof loadFingerprintAgent>> | undefined = undefined;
}
