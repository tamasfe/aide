import type { ClickTrackingRepositoryI } from "~/packages/click-tracking/domain/ClickTrackingRepository";
import { CreateTrackingClick } from "~/packages/click-tracking/application/CreateTrackingClick";
import { UpdateTrackingSession } from "~/packages/click-tracking/application/UpdateTrackingSession";
import { ClicksTrackingRepoAPI } from "~/packages/click-tracking/infra/ClicksTrackingRepoAPI";
import { ClicksTrackingRepoDumb } from "~/packages/click-tracking/infra/ClicksTrackingRepoDumb";
import { FingerprintService } from "~/packages/click-tracking/infra/FingerprintService";
import { MarketingSearchParamsRepoLocalStorage } from "~/modules/search-params-tracking/marketing-search-params-repo-local-storage";
import { StoreMarketingSearchParams } from "~/modules/search-params-tracking/ui/store-marketing-search-params";
import { UsersPreviousActivityCookieRepo } from "~/modules/search-params-tracking/users-previous-activity-cookie-repo";

export default function () {
  const runtimeConfig = useRuntimeConfig();
  const logger = useLogger();

  const siteStore = useSiteStore();

  const marketingSearchParamsRepo = new MarketingSearchParamsRepoLocalStorage();

  const clicksTrackingRepo: ClickTrackingRepositoryI = (() => {
    switch (runtimeConfig.public.tracking.apiMode) {
      case "mock":
        return new ClicksTrackingRepoDumb();
      default:
        return new ClicksTrackingRepoAPI(`${runtimeConfig.public.apiClientProtocol}${siteStore.domain.tracking}`);
    }
  })();

  const fingerprintService = new FingerprintService();

  const usersPreviousActivityCookieRepo = new UsersPreviousActivityCookieRepo(
    import.meta.server,
    useCookie,
  );

  return {
    repositories: {
      clicksTrackingRepo,
      marketingSearchParamsRepo,
    },
    ui: {
      createTrackingClick: new CreateTrackingClick(
        fingerprintService,
        clicksTrackingRepo,
      ),
      storeMarketingSearchParams: new StoreMarketingSearchParams(
        marketingSearchParamsRepo,
      ),
      updateTrackingSession: new UpdateTrackingSession(
        fingerprintService,
        clicksTrackingRepo,
      ),
      setUsersPreviousActivity: async (value: string): Promise<void> => {
        const result = await usersPreviousActivityCookieRepo.set(value);
        if (result.isFailure) {
          logger.error(
            "Error setting users previous activity cookie. Tolerating as this is only used for better modal behaviour",
            result.error,
          );
        }
      },
    },
  };
}
