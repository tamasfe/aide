import type { SitesRepositoryI } from "~/modules/sites/domain/SitesRepository";
import { FindMatchedSite } from "~/modules/sites/infra/ui/FindMatchedSite";
import { SitesRepositoryGirobet } from "~/modules/sites/infra/SitesRepositoryGirobet";
import { SitesRepositoryDumb } from "~/modules/sites/infra/SitesRepositoryDumb";
import { FindMatchedLicenses } from "~/modules/sites/infra/ui/FindMatchedLicenses";

export default function () {
  const runtimeConfig = useRuntimeConfig();
  const { $apiClient } = useNuxtApp();
  const logger = useLogger();

  const sitesRepo: SitesRepositoryI = (() => {
    switch (runtimeConfig.public.sites?.apiMode) {
      case "mock":
        return new SitesRepositoryDumb(logger);
      default:
        return new SitesRepositoryGirobet($apiClient);
    }
  })();

  return {
    ui: {
      findMatchedSite: new FindMatchedSite(sitesRepo, logger),
      findMatchedLicenses: new FindMatchedLicenses(sitesRepo, logger),
    },
  };
}
