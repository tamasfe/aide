import type { KycUserStatus } from "./KycUserStatus";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface KycApiRepositoryI {
  findStatus: () => Promise<Result<KycUserStatus, InfrastructureError>>;
  findAccessToken: () => Promise<Result<{
    value: string;
    provider: "sumsub";
    applicantData: {
      country: string;
      email: string;
      phone: string;
      language: string;
    };
  }, InfrastructureError>>;
}
