import type { SitesRepositoryI } from "../domain/SitesRepository";
import type { Site } from "../domain/Site";
import type { LoggerI } from "~/packages/logger/Logger";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class SitesRepositoryDumb implements SitesRepositoryI {
  constructor(private logger: LoggerI) {}

  public async findCurrentMatched(): Promise<Result<Site, InfrastructureError>> {
    this.logger.debug("findCurrent called");
    return success({
      servable: true,
      name: "GiroBet",
      identifier: "girobet",
      domains: [],
    });
  }
}
