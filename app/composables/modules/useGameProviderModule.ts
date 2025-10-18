import type { ProvidersRepositoryI } from "~/modules/providers/domain/ProvidersRepository";
import { SearchProvidersPaginating } from "~/modules/providers/application/SearchProvidersPaginating";
import { ProvidersRepositoryDumb } from "~/modules/providers/infra/ProvidersRepositoryDumb";
import { ProvidersRepositoryGirobet } from "~/modules/providers/infra/ProvidersRepositoryGirobet";
import { SearchProvidersOnGrid } from "~/modules/providers/infra/ui/SearchProvidersOnGrid";
import { ListGameProvidersPaginatingOnGrid } from "~/modules/providers/infra/ui/ListGameProvidersPaginatingOnGrid";
import { FindProviderByIdentifierOnProviderPage } from "~/modules/providers/infra/ui/FindProviderByIdOnProviderPage";

export default function () {
  const runtimeConfig = useRuntimeConfig();
  const { $apiClient } = useNuxtApp();
  const logger = useLogger();

  const providersApiRepository: ProvidersRepositoryI = (() => {
    switch (runtimeConfig.public.providers?.apiMode) {
      case "mock":
        return new ProvidersRepositoryDumb(logger);
      default:
        return new ProvidersRepositoryGirobet($apiClient);
    }
  })();

  return {
    ui: {
      searchProvidersOnGrid: new SearchProvidersOnGrid(
        new SearchProvidersPaginating(providersApiRepository),
        logger,
      ),
      listProvidersOnGrid: new ListGameProvidersPaginatingOnGrid(
        providersApiRepository,
        logger,
      ),
      findProviderByIdentifierOnProviderPage: new FindProviderByIdentifierOnProviderPage(
        providersApiRepository,
        logger,
      ),
    },
  };
}
