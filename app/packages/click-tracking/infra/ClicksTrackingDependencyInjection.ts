import type { PublicRuntimeConfig } from "nuxt/schema";
import type { ClickTrackingRepositoryI } from "../domain/ClickTrackingRepository";
import { CreateTrackingClick } from "../application/CreateTrackingClick";
import { UpdateTrackingSession } from "../application/UpdateTrackingSession";
import { ClicksTrackingRepoAPI } from "./ClicksTrackingRepoAPI";
import { ClicksTrackingRepoDumb } from "./ClicksTrackingRepoDumb";
import { FingerprintService } from "./FingerprintService";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";
import { MarketingSearchParamsRepoLocalStorage } from "~/modules/search-params-tracking/marketing-search-params-repo-local-storage";
import { StoreMarketingSearchParams } from "~/modules/search-params-tracking/ui/store-marketing-search-params";
import { HandleOpenModalSearchParam } from "~/modules/search-params-tracking/ui/handle-open-modal-search-param";
import { UsersPreviousActivityCookieRepo } from "~/modules/search-params-tracking/users-previous-activity-cookie-repo";

export interface ClicksTrackingDependencyInjectionI {
  repositories: {
    marketingSearchParamsRepo: MarketingSearchParamsRepoLocalStorage;
    clicksTrackingRepo: ClickTrackingRepositoryI;
  };
  ui: {
    createTrackingClick: CreateTrackingClick;
    storeMarketingSearchParams: StoreMarketingSearchParams;
    updateTrackingSession: UpdateTrackingSession;
    handleOpenModalSearchParam: HandleOpenModalSearchParam;
    setUsersPreviousActivity: (value: string) => Promise<void>;
  };
}

export const createClicksTrackingDependencyInjection = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI): Promise<ClicksTrackingDependencyInjectionI> => {
  const router = useRouter();
  const apiBaseUrl = useCasinoApiOrigin("tracking");
  const mode = config.tracking.apiMode;

  const marketingSearchParamsRepo = new MarketingSearchParamsRepoLocalStorage();

  const clicksTrackingRepo: ClickTrackingRepositoryI = (() => {
    if (mode === "api") {
      return new ClicksTrackingRepoAPI(apiBaseUrl);
    }
    return new ClicksTrackingRepoDumb();
  })();

  const fingerprintService = new FingerprintService();

  const usersPreviousActivityCookieRepo = new UsersPreviousActivityCookieRepo(import.meta.server);

  return {
    repositories: {
      clicksTrackingRepo,
      marketingSearchParamsRepo,
    },
    ui: {
      createTrackingClick: new CreateTrackingClick(fingerprintService, clicksTrackingRepo),
      storeMarketingSearchParams: new StoreMarketingSearchParams(marketingSearchParamsRepo),
      updateTrackingSession: new UpdateTrackingSession(fingerprintService, clicksTrackingRepo),
      handleOpenModalSearchParam: new HandleOpenModalSearchParam(
        usersPreviousActivityCookieRepo,
        commonDependencies.logger,
        commonDependencies.asyncMessagePublisher,
        () => router.push({ path: "/settings/account" }).then(() => {}),
      ),
      setUsersPreviousActivity: async (value: string): Promise<void> => {
        const result = await usersPreviousActivityCookieRepo.set(value);
        if (result.isFailure) {
          commonDependencies.logger.error("Error setting users previous activity cookie. Tolerating as this is only used for better modal behaviour", result.error);
        }
      },
    },
  };
};
