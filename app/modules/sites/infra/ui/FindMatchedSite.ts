import type { SitesRepositoryI } from "../../domain/SitesRepository";
import type { SiteResponse } from "../../domain/Site";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { LoggerI } from "~/packages/logger/Logger";

export class FindMatchedSite {
  constructor(private sitesRepo: SitesRepositoryI, private logger: LoggerI) {}

  public async handle(): Promise<Result<SiteResponse, InfrastructureError>> {
    const resultSearching = await this.sitesRepo.findCurrentMatched();

    if (resultSearching.isFailure) {
      this.logger.error("Error searching for current site", resultSearching.error);
      return resultSearching;
    }

    return resultSearching;
  }
}
