import type { WebsocketAccessTokenRepositoryI } from "~/packages/websocket/domain/websocket-access-token-repository";
import { WebsocketAccessTokensRepositoryGirobet } from "~/packages/websocket/infra/websocket-access-token-repository-girobet";
import { CreateWebsocketConnection } from "~/packages/websocket/infra/ui/create-websocket-connection";
import { WebsocketTickerChannelManagerNewWins } from "~/packages/websocket/infra/ui/websocket-ticker-channel-manager-new-wins";
import { WebsocketUserChannelsManager } from "~/packages/websocket/infra/ui/websocket-user-channels-manager-user";

export default function () {
  const { $apiClient } = useNuxtApp();
  const logger = useLogger();
  const nuxtApp = useNuxtApp();
  const siteStore = useSiteStore();
  const runtimeConfig = useRuntimeConfig();

  const websocketAccessTokenRepository: WebsocketAccessTokenRepositoryI
    = new WebsocketAccessTokensRepositoryGirobet($apiClient);

  return {
    ui: {
      createWebsocketConnection: new CreateWebsocketConnection(
        `${runtimeConfig.public.apiClientProtocol}${siteStore.domain.api}`,
        logger,
        nuxtApp,
      ),
      wsChannelManagers: {
        user: new WebsocketUserChannelsManager(
          websocketAccessTokenRepository,
          logger,
        ),
        ticker: new WebsocketTickerChannelManagerNewWins(logger),
      },
    },
  };
}
