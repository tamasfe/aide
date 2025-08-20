import type { SitesRepositoryI } from "../domain/SitesRepository";
import type { SiteResponse } from "../domain/Site";
import type { License } from "../domain/License";
import type { LoggerI } from "~/packages/logger/Logger";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class SitesRepositoryDumb implements SitesRepositoryI {
  constructor(private logger: LoggerI) {}

  public async findCurrentMatched(): Promise<Result<SiteResponse, InfrastructureError>> {
    this.logger.debug("findCurrent called");
    // return success({
    //   servable: true,
    //   name: "GiroBet",
    //   identifier: "girobet",
    //   domains: [],
    // });

    // In case we want to see the ZambaBet site:
    return success({
      site: {
        id: 0,
        servable: true,
        name: "SomeSite",
        identifier: "somesite",
      },
      domain: {
        api: "api.example.com",
        email: "example.com",
        frontend: "example.com",
        cdn: "cdn.example.com",
        tracking: "tracking.example.com",
      },
    });
  }

  public async findMatchedLicenses(): Promise<Result<License[], InfrastructureError>> {
    this.logger.debug("findLicenses called");
    return success([
      {
        id: 1,
        name: "Anjouan",
        rootJurisdiction: "KM" as const,
      },
    ]);
  }
}
