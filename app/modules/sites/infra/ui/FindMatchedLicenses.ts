import type { SitesRepositoryI } from "../../domain/SitesRepository";
import type { License } from "../../domain/License";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { LoggerI } from "~/packages/logger/Logger";

export class FindMatchedLicenses {
  constructor(private sitesRepo: SitesRepositoryI, private logger: LoggerI) {}

  public async handle(): Promise<Result<License[], InfrastructureError>> {
    const resultSearching = await this.sitesRepo.findMatchedLicenses();

    if (resultSearching.isFailure) {
      this.logger.error("Error searching for current site", resultSearching.error);
      return resultSearching;
    }

    return resultSearching;
  }
}
