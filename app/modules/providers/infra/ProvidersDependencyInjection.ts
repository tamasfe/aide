import type { PublicRuntimeConfig } from "nuxt/schema";
import type { ProvidersRepositoryI } from "../domain/ProvidersRepository";
import { SearchProvidersPaginating } from "../application/SearchProvidersPaginating";
import { FindProviderById } from "../application/FindProviderById";
import { FindProviderImageSrcById } from "./ui/FindProviderImageSrcById";
import { ProvidersRepositoryDumb } from "./ProvidersRepositoryDumb";
import { ProvidersRepositoryGirobet } from "./ProvidersRepositoryGirobet";
import { SearchProvidersOnGrid } from "./ui/SearchProvidersOnGrid";
import { FindProviderByIdOnProviderPage } from "./ui/FindProviderByIdOnProviderPage";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface ProvidersDependencyInjectionI {
  ui: {
    findProviderImageSrcById: FindProviderImageSrcById;
    searchProvidersOnGrid: SearchProvidersOnGrid;
    findProviderByIdOnProviderPage: FindProviderByIdOnProviderPage;
  };
}

export const createProvidersDependencyInjection = async (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, requestHeaders?: Record<string, string>): Promise<ProvidersDependencyInjectionI> => {
  const isServer = import.meta.server;
  const apiBaseUrl = isServer ? publicConfig.providers.apiBaseUrlServer : publicConfig.providers.apiBaseUrlClient;

  const providersApiRepository: ProvidersRepositoryI = (() => {
    if (!apiBaseUrl || apiBaseUrl === "") {
      return new ProvidersRepositoryDumb(commonDependencies.logger);
    }
    return new ProvidersRepositoryGirobet({ baseUrl: apiBaseUrl, headers: requestHeaders, userJurisdiction: publicConfig.genericFixedUserJurisdiction }, commonDependencies.asyncMessagePublisher);
  })();

  return {
    ui: {
      findProviderImageSrcById: new FindProviderImageSrcById(publicConfig.providers.apiBaseUrlClient || ""),
      searchProvidersOnGrid: new SearchProvidersOnGrid(
        new SearchProvidersPaginating(providersApiRepository),
        commonDependencies.logger,
      ),
      findProviderByIdOnProviderPage: new FindProviderByIdOnProviderPage(
        new FindProviderById(providersApiRepository),
        commonDependencies.logger,
      ),
    },
  };
};
