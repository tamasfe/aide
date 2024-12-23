import type { KycApiRepositoryI } from "../../domain/KycApiRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class RenewKycAccessTokenOnAccountVerification {
  constructor(
    private repo: KycApiRepositoryI,
    private logger: LoggerI,
  ) {}

  public async handle(): Promise<string> {
    const accessTokenDataResult = await this.repo.findAccessToken();
    if (accessTokenDataResult.isFailure) {
      this.logger.error("Error retrieving the KYC status on the account verification page", accessTokenDataResult.error);
      return "";
    }

    return accessTokenDataResult.value.value;
  }
}
