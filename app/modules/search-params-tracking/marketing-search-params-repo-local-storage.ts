import { AbstractExtendedError, type CustomError, fail, type EmptyResult, type Result, success } from "~/packages/result";

interface SearchParamsStorerRecord {
  params: Record<string, string>;
  at: string;
}

export class MarketingSearchParamsRepoLocalStorage {
  private readonly storageKey = "girobet-search-params-history";

  /**
   * Following Chad's decision: it's the first ever search params
   */
  searchAttributed(): Result<{ at: Date; params: Record<string, string> } | null, ErrorSearchingSearchParams> {
    try {
      const currentParamsRaw = localStorage.getItem(this.storageKey);
      const currentParams = currentParamsRaw ? JSON.parse(currentParamsRaw) as SearchParamsStorerRecord[] : [];
      if (currentParams.length === 0) {
        return success(null);
      }

      // Find first params according to the timestamp inside
      const sortedParams = currentParams.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
      const firstParams = sortedParams[0];
      return firstParams
        ? success({
            at: new Date(firstParams.at),
            params: firstParams.params,
          })
        : success(null);
    }
    catch (error: unknown) {
      return fail(new ErrorSearchingSearchParams({ }, ErrorSearchingSearchParams.parseCause(error)));
    }
  }

  save(params: URLSearchParams, at: Date): EmptyResult<ErrorStoringSearchParams> {
    try {
      const paramsToSave: SearchParamsStorerRecord = {
        params: Object.fromEntries(params.entries()),
        at: at.toISOString(),
      };

      const currentParamsRaw = localStorage.getItem(this.storageKey);
      const currentParams = currentParamsRaw ? JSON.parse(currentParamsRaw) as SearchParamsStorerRecord[] : [];

      currentParams.push(paramsToSave);
      localStorage.setItem(this.storageKey, JSON.stringify(currentParams));

      return success();
    }
    catch (error: unknown) {
      return fail(new ErrorStoringSearchParams({ attemptedParamsToStore: params }, ErrorStoringSearchParams.parseCause(error)));
    }
  }
}

class ErrorStoringSearchParams extends AbstractExtendedError {
  public name = "ErrorStoringSearchParams" as const;

  constructor(metadata: Record<string, unknown>, cause: Error | CustomError) {
    super("Error storing search params", metadata, cause);
  }
}

class ErrorSearchingSearchParams extends AbstractExtendedError {
  public name = "ErrorSearchingSearchParams" as const;

  constructor(metadata: Record<string, unknown>, cause: Error | CustomError) {
    super("Error searching search params", metadata, cause);
  }
}
