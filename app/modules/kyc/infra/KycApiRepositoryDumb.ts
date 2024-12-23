import type { KycApiRepositoryI } from "../domain/KycApiRepository";
import type { KycUserStatus } from "../domain/KycUserStatus";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class KycApiRepositoryDumb implements KycApiRepositoryI {
  public async findStatus(): Promise<Result<KycUserStatus, InfrastructureError>> {
    return success("INACTIVE");
  }

  public async findAccessToken(): Promise<Result<{ value: string; provider: "sumsub"; applicantData: { country: string; email: string; phone: string; language: string } }, InfrastructureError>> {
    return success({
      value: "token",
      provider: "sumsub",
      applicantData: {
        country: "BR",
        email: "john@doe.com",
        phone: "+5511999999999",
        language: "pt-br",
      },
    });
  }
}
