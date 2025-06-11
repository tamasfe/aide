import type { SitesRepositoryI } from "../domain/SitesRepository";
import { FindMatchedSite } from "./ui/FindMatchedSite";
import { SitesRepositoryGirobet } from "./SitesRepositoryGirobet";
import { SitesRepositoryDumb } from "./SitesRepositoryDumb";
import { FindMatchedLicenses } from "./ui/FindMatchedLicenses";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface SitesDependencyInjectionI {
  ui: {
    findMatchedSite: FindMatchedSite;
    findMatchedLicenses: FindMatchedLicenses;
  };
}

export const createSitesDependencyInjection = async (config: { apiBaseUrl: string; mode: "dumb" | "api" }, commonDependencies: CommonDependenciesI): Promise<SitesDependencyInjectionI> => {
  const sitesRepo: SitesRepositoryI = (() => {
    if (config.mode === "api") {
      return new SitesRepositoryGirobet({ baseUrl: config.apiBaseUrl }, commonDependencies);
    }
    return new SitesRepositoryDumb(commonDependencies.logger);
  })();

  return {

    ui: {
      findMatchedSite: new FindMatchedSite(sitesRepo, commonDependencies.logger),
      findMatchedLicenses: new FindMatchedLicenses(sitesRepo, commonDependencies.logger),
    },
  };
};
