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

export interface ClicksTrackingDependencyInjectionI {
  repositories: {
    marketingSearchParamsRepo: MarketingSearchParamsRepoLocalStorage;
    clicksTrackingRepo: ClickTrackingRepositoryI;
  };
  ui: {
    createTrackingClick: CreateTrackingClick;
    storeMarketingSearchParams: StoreMarketingSearchParams;
    updateTrackingSession: UpdateTrackingSession;
  };
}

export const createClicksTrackingDependencyInjection = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI): Promise<ClicksTrackingDependencyInjectionI> => {
  const apiBaseUrl = config.tracking.apiBaseUrl;

  const marketingSearchParamsRepo = new MarketingSearchParamsRepoLocalStorage();

  const clicksTrackingRepo: ClickTrackingRepositoryI = (() => {
    if (apiBaseUrl) {
      return new ClicksTrackingRepoAPI(apiBaseUrl);
    }
    return new ClicksTrackingRepoDumb();
  })();

  const fingerprintService = new FingerprintService(commonDependencies.logger);

  return {
    repositories: {
      clicksTrackingRepo,
      marketingSearchParamsRepo,
    },
    ui: {
      createTrackingClick: new CreateTrackingClick(fingerprintService, clicksTrackingRepo),
      storeMarketingSearchParams: new StoreMarketingSearchParams(marketingSearchParamsRepo),
      updateTrackingSession: new UpdateTrackingSession(fingerprintService, clicksTrackingRepo),
    },
  };
};
