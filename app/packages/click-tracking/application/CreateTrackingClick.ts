import type { ClickTrackingRepositoryI } from "../domain/ClickTrackingRepository";
import type { FingerprintServiceI } from "../infra/FingerprintService";

export class CreateTrackingClick {
  constructor(
    private fingerprintService: FingerprintServiceI,
    private clicksTrackingRepo: ClickTrackingRepositoryI,
  ) {}

  public async handle(userId: number | null, path: string, queryParams: URLSearchParams) {
    if (!this.fingerprintService.isInitialized()) {
      const resultInitingLibrary = await this.fingerprintService.initLibrary();
      if (resultInitingLibrary.isFailure) {
        return resultInitingLibrary;
      }
    }

    const fingerPrintResult = await this.fingerprintService.getFingerprint();
    if (fingerPrintResult.isFailure) {
      return fingerPrintResult;
    }

    return this.clicksTrackingRepo.store({
      userId,
      fingerprintValue: fingerPrintResult.value.visitorId,
      path,
    }, queryParams);
  }
}
