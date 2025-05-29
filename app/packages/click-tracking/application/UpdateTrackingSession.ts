import type { ClickTrackingRepositoryI } from "../domain/ClickTrackingRepository";
import type { FingerprintService } from "../infra/FingerprintService";

export class UpdateTrackingSession {
  constructor(
    private readonly fingerprintService: FingerprintService,
    private readonly repository: ClickTrackingRepositoryI,
  ) {}

  public async handle(
    userId: number,
  ) {
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

    return this.repository.update({
      userId,
      fingerprintValue: fingerPrintResult.value.visitorId,
    });
  }
}
