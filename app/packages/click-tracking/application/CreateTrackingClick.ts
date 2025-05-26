import type { ClickTrackingRepositoryI } from "../domain/ClickTrackingRepository";
import type { FingerprintService } from "../infra/FingerprintService";

export class CreateTrackingClick {
  constructor(
    private fingerprintService: FingerprintService,
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
