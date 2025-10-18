import type { KycApiRepositoryI } from "~/modules/kyc/domain/KycApiRepository";
import { KycApiRepositoryDumb } from "~/modules/kyc/infra/KycApiRepositoryDumb";
import { KycApiRepositoryGirobet } from "~/modules/kyc/infra/KycApiRepositoryGirobet";
import { FindUserKycStatusOnAccountVerification } from "~/modules/kyc/infra/ui/FindUserKycStatusOnAccountVerification";
import { RenewKycAccessTokenOnAccountVerification } from "~/modules/kyc/infra/ui/RenewKycAccessTokenOnAccountVerification";

export default function () {
  const runtimeConfig = useRuntimeConfig();
  const { $apiClient } = useNuxtApp();
  const logger = useLogger();

  const kycApiRepository: KycApiRepositoryI = (() => {
    switch (runtimeConfig.public.kyc?.apiMode) {
      case "mock":
        return new KycApiRepositoryDumb();
      default:
        return new KycApiRepositoryGirobet($apiClient);
    }
  })();

  return {
    ui: {
      findUserKycStatus: new FindUserKycStatusOnAccountVerification(
        kycApiRepository,
        logger,
      ),
      renewAccessToken: new RenewKycAccessTokenOnAccountVerification(
        kycApiRepository,
        logger,
      ),
    },
  };
}
