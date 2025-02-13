import type { Site } from "./Site";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface SitesRepositoryI {
  findCurrentMatched: () => Promise<Result<Site, InfrastructureError>>;
}
