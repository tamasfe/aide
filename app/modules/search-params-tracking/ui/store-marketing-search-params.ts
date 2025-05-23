import { pickWhitelistedParams } from "../pick-whitelisted-params";
import type { MarketingSearchParamsRepoLocalStorage } from "../marketing-search-params-repo-local-storage";
import { success } from "~/packages/result";

export class StoreMarketingSearchParams {
  constructor(
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

    return success();
  }
}
