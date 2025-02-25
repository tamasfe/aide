import type { Site } from "./Site";
import type { License } from "./License";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface SitesRepositoryI {
  findCurrentMatched: () => Promise<Result<Site, InfrastructureError>>;
  findMatchedLicenses: () => Promise<Result<License[], InfrastructureError>>;
}
