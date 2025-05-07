import type { PublicRuntimeConfig } from "nuxt/schema";
import type { ProvidersRepositoryI } from "../domain/ProvidersRepository";
import { SearchProvidersPaginating } from "../application/SearchProvidersPaginating";
import { FindProviderImageSrcById } from "./ui/FindProviderImageSrcById";
import { ProvidersRepositoryDumb } from "./ProvidersRepositoryDumb";
import { ProvidersRepositoryGirobet } from "./ProvidersRepositoryGirobet";
import { SearchProvidersOnGrid } from "./ui/SearchProvidersOnGrid";
import { FindProviderByIdentifierOnProviderPage } from "./ui/FindProviderByIdOnProviderPage";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface ProvidersDependencyInjectionI {
  ui: {
    findProviderImageSrcById: FindProviderImageSrcById;
    searchProvidersOnGrid: SearchProvidersOnGrid;
    findProviderByIdentifierOnProviderPage: FindProviderByIdentifierOnProviderPage;
  };
}

export const createProvidersDependencyInjection = async (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI): Promise<ProvidersDependencyInjectionI> => {
  const isServer = import.meta.server;
  const apiBaseUrl = isServer ? publicConfig.providers.apiBaseUrlServer : publicConfig.providers.apiBaseUrlClient;

  const providersApiRepository: ProvidersRepositoryI = (() => {
    if (!apiBaseUrl || apiBaseUrl === "") {
      return new ProvidersRepositoryDumb(commonDependencies.logger);
    }
    return new ProvidersRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  return {
    ui: {
      findProviderImageSrcById: new FindProviderImageSrcById(publicConfig.providers.apiBaseUrlClient || ""),
      searchProvidersOnGrid: new SearchProvidersOnGrid(
        new SearchProvidersPaginating(providersApiRepository),
        commonDependencies.logger,
      ),
      findProviderByIdentifierOnProviderPage: new FindProviderByIdentifierOnProviderPage(
        providersApiRepository,
        commonDependencies.logger,
      ),
    },
  };
};
