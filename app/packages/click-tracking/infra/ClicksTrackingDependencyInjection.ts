import type { RouteLocationNormalizedLoadedGeneric } from "vue-router";
import type { PublicRuntimeConfig } from "nuxt/schema";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";
import { MarketingSearchParamsRepoLocalStorage } from "~/modules/search-params-tracking/marketing-search-params-repo-local-storage";
import { StoreMarketingSearchParams } from "~/modules/search-params-tracking/ui/store-marketing-search-params";

export interface ClicksTrackingDependencyInjectionI {
  repository: MarketingSearchParamsRepoLocalStorage;
  ui: {
    storeMarketingSearchParams: StoreMarketingSearchParams;
  };
}

export const createClicksTrackingDependencyInjection = async (route: RouteLocationNormalizedLoadedGeneric, _config: PublicRuntimeConfig, _commonDependencies: CommonDependenciesI): Promise<ClicksTrackingDependencyInjectionI> => {
  // const apiBaseUrl = config.apiBaseUrlClient;

  const marketingSearchParamsRepo = new MarketingSearchParamsRepoLocalStorage();

  return {
    repository: marketingSearchParamsRepo,
    ui: {
      storeMarketingSearchParams: new StoreMarketingSearchParams(route, marketingSearchParamsRepo),
    },
  };
};
