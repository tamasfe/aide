import type { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { load as loadFingerprintAgent, defaultEndpoint, defaultScriptUrlPattern } from "@fingerprintjs/fingerprintjs-pro";
import { ExceptionGettingUserFingerprint } from "../domain/ExceptionGettingUserFingerprint";
import type { LoggerI } from "~/packages/logger/Logger";
import { fail, success, type EmptyResult, type Result } from "~/packages/result";

export interface FingerprintServiceI {
  getFingerprint(): Promise<Result<GetResult, ExceptionGettingUserFingerprint>>;
  isInitialized(): boolean;
  initLibrary(): Promise<EmptyResult<ExceptionGettingUserFingerprint>>;
}

export class FingerprintService implements FingerprintServiceI {
  constructor(private logger: LoggerI, private publicApiKey: string, private scriptEndpoint: string) {}

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
      apiKey: this.publicApiKey,
      region: "us",
      endpoint: [
        this.scriptEndpoint,
        "https://summitcoreapi.com/EkkWvBzKSGMIQZw4/1qDponqL8OE8LDgt",
        defaultEndpoint,
      ],
      scriptUrlPattern: [
        `${this.scriptEndpoint}?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>`,
        "https://summitcoreapi.com/EkkWvBzKSGMIQZw4/gX1mE3XcxvYXpG9I?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>",
        defaultScriptUrlPattern,
      ],
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
