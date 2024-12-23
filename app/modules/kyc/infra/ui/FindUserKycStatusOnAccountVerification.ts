import type { KycApiRepositoryI } from "../../domain/KycApiRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export type FindUserKycStatusResponseI = {
  status: "ACTIVE";
  data: null;
} | {
  status: "INACTIVE";
  data: {
    accessToken: string;
    provider: "sumsub";
    applicantData: {
      email: string;
      phone: string;
      language: string;
    };
  };
};

export class FindUserKycStatusOnAccountVerification {
  constructor(
    private repo: KycApiRepositoryI,
    private logger: LoggerI,
  ) {}

  public async handle(): Promise<null | FindUserKycStatusResponseI> {
    const kycStatusResult = await this.repo.findStatus();
    if (kycStatusResult.isFailure) {
      this.logger.error("Error retrieving the KYC status on the account verification page", kycStatusResult.error);
      return null;
    }

    if (kycStatusResult.value === "ACTIVE") {
      return {
        status: "ACTIVE",
        data: null,
      };
    }

    const accessTokenDataResult = await this.repo.findAccessToken();
    if (accessTokenDataResult.isFailure) {
      this.logger.error("Error retrieving the KYC access token on the account verification page", accessTokenDataResult.error);
      return null;
    }

    return {
      status: "INACTIVE",
      data: {
        accessToken: accessTokenDataResult.value.value,
        provider: accessTokenDataResult.value.provider,
        applicantData: accessTokenDataResult.value.applicantData,
      },
    };
  }
}
