import type { PublicRuntimeConfig } from "nuxt/schema";
import type { KycApiRepositoryI } from "../domain/KycApiRepository";
import { KycApiRepositoryDumb } from "./KycApiRepositoryDumb";
import { KycApiRepositoryGirobet } from "./KycApiRepositoryGirobet";
import { FindUserKycStatusOnAccountVerification } from "./ui/FindUserKycStatusOnAccountVerification";
import { RenewKycAccessTokenOnAccountVerification } from "./ui/RenewKycAccessTokenOnAccountVerification";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface KycDependencyInjectionI {
  ui: {
    findUserKycStatus: FindUserKycStatusOnAccountVerification;
    renewAccessToken: RenewKycAccessTokenOnAccountVerification;
  };
}

export const createKycDependencyInjection = async (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI): Promise<KycDependencyInjectionI> => {
  const apiBaseUrl = useCasinoApiOrigin("api");
  const mode = publicConfig.kyc.apiMode;

  const kycApiRepository: KycApiRepositoryI = (() => {
    if (mode === "dumb") {
      return new KycApiRepositoryDumb();
    }
    return new KycApiRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  return {
    ui: {
      findUserKycStatus: new FindUserKycStatusOnAccountVerification(kycApiRepository, commonDependencies.logger),
      renewAccessToken: new RenewKycAccessTokenOnAccountVerification(kycApiRepository, commonDependencies.logger),
    },
  };
};
