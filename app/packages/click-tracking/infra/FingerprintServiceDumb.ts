import type { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import type { ExceptionGettingUserFingerprint } from "../domain/ExceptionGettingUserFingerprint";
import type { FingerprintServiceI } from "./FingerprintService";
import { success, type Result } from "~/packages/result";

export class FingerprintServiceDumb implements FingerprintServiceI {
  public async getFingerprint(): Promise<Result<GetResult, ExceptionGettingUserFingerprint>> {
    return success({
      requestId: "dummy-request-id",
      visitorId: "dummy-visitor-id",
      fingerprint: "dummy-fingerprint",
      visitorFound: true,
      components: {},
      rawData: {},
      confidence: {
        score: 1,
      },
      isBot: false,
    });
  }

  public isInitialized(): boolean {
    return false;
  }

  /**
   * Beware of awaiting this function, as it loads a whole library with it.
   * More info @https://dev.fingerprint.com/docs/install-the-javascript-agent#configuring-the-agent
   */
  public async initLibrary() {
    return success();
  }
}
