import type { RouteLocationNormalizedLoadedGeneric } from "vue-router";
import { pickWhitelistedParams } from "../pick-whitelisted-params";
import type { MarketingSearchParamsRepoLocalStorage } from "../marketing-search-params-repo-local-storage";
import { success } from "~/packages/result";

export class StoreMarketingSearchParams {
  constructor(
    private route: RouteLocationNormalizedLoadedGeneric,
    private repository: MarketingSearchParamsRepoLocalStorage,
  ) {}

  public handle(searchParams: URLSearchParams) {
    const whitelistedParms = pickWhitelistedParams(searchParams);
    if (whitelistedParms.size === 0) {
      return success();
    }

    const resultStoring = this.repository.save(whitelistedParms, new Date());
    if (resultStoring.isFailure) {
      return resultStoring;
    }

    /*
    *  Remove whitelisted params from the URL without navigating
    */
    for (const [key] of whitelistedParms.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.route.query[key];
    }

    return success();
  }
}
