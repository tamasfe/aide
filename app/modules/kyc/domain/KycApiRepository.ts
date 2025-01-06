import type { KycUserStatus } from "./KycUserStatus";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface KycApiRepositoryI {
  findStatus: () => Promise<Result<KycUserStatus, InfrastructureError>>;
  findAccessToken: () => Promise<Result<{
    value: string;
    provider: components["schemas"]["IntegrationIdentifier"];
    applicantData: {
      country: string;
      email: string;
      phone: string;
      language: string;
    };
  }, InfrastructureError>>;
}
