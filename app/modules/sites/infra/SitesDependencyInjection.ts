import type { PublicRuntimeConfig } from "nuxt/schema";
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

export const createSitesDependencyInjection = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI): Promise<SitesDependencyInjectionI> => {
  const apiBaseUrl = config.apiBaseUrlClient;

  const sitesRepo: SitesRepositoryI = (() => {
    return new SitesRepositoryDumb(commonDependencies.logger);
    if (apiBaseUrl) {
      return new SitesRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
    }
  })();

  return {

    ui: {
      findMatchedSite: new FindMatchedSite(sitesRepo, commonDependencies.logger),
      findMatchedLicenses: new FindMatchedLicenses(sitesRepo, commonDependencies.logger),
    },
  };
};
