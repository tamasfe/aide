import type { PublicRuntimeConfig } from "nuxt/schema";
import type { ProvidersRepositoryI } from "../domain/ProvidersRepository";
import { SearchProvidersPaginating } from "../application/SearchProvidersPaginating";
import { ProvidersRepositoryDumb } from "./ProvidersRepositoryDumb";
import { ProvidersRepositoryGirobet } from "./ProvidersRepositoryGirobet";
import { SearchProvidersOnGrid } from "./ui/SearchProvidersOnGrid";
import { ListGameProvidersPaginatingOnGrid } from "./ui/ListGameProvidersPaginatingOnGrid";
import { FindProviderByIdentifierOnProviderPage } from "./ui/FindProviderByIdOnProviderPage";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface ProvidersDependencyInjectionI {
  ui: {
    searchProvidersOnGrid: SearchProvidersOnGrid;
    listProvidersOnGrid: ListGameProvidersPaginatingOnGrid;
    findProviderByIdentifierOnProviderPage: FindProviderByIdentifierOnProviderPage;
  };
}

export const createProvidersDependencyInjection = async (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI): Promise<ProvidersDependencyInjectionI> => {
  const apiBaseUrl = useCasinoApiOrigin("api");
  const mode = publicConfig.providers.apiMode;

  const providersApiRepository: ProvidersRepositoryI = (() => {
    if (mode === "dumb") {
      return new ProvidersRepositoryDumb(commonDependencies.logger);
    }
    return new ProvidersRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  return {
    ui: {
      searchProvidersOnGrid: new SearchProvidersOnGrid(
        new SearchProvidersPaginating(providersApiRepository),
        commonDependencies.logger,
      ),
      listProvidersOnGrid: new ListGameProvidersPaginatingOnGrid(
        providersApiRepository,
        commonDependencies.logger,
      ),
      findProviderByIdentifierOnProviderPage: new FindProviderByIdentifierOnProviderPage(
        providersApiRepository,
        commonDependencies.logger,
      ),
    },
  };
};
