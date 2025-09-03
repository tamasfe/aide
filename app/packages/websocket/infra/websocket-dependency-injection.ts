import type { PublicRuntimeConfig } from "nuxt/schema";
import type { WebsocketAccessTokenRepositoryI } from "../domain/websocket-access-token-repository";
import { WebsocketAccessTokensRepositoryGirobet } from "./websocket-access-token-repository-girobet";
import { CreateWebsocketConnection } from "./ui/create-websocket-connection";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";
import { WebsocketTickerChannelManagerNewWins } from "./ui/websocket-ticker-channel-manager-new-wins";
import { WebsocketUserChannelsManager } from "./ui/websocket-user-channels-manager-user";

export interface WebsocketDependencyInjectionI {
  ui: {
    createWebsocketConnection: CreateWebsocketConnection;
    wsChannelManagers: {
      user: WebsocketUserChannelsManager;
      ticker: WebsocketTickerChannelManagerNewWins;
    };
  };
}

export const createWebsocketDependencyInjectionI: (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI) => Promise<WebsocketDependencyInjectionI> = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI) => {
  const apiBaseUrl = useCasinoApiOrigin("api");
  const websocketAccessTokenRepository: WebsocketAccessTokenRepositoryI = new WebsocketAccessTokensRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);

  return {
    ui: {
      createWebsocketConnection: new CreateWebsocketConnection(apiBaseUrl, commonDependencies.logger, commonDependencies.asyncMessagePublisher),
      wsChannelManagers: {
        user: new WebsocketUserChannelsManager(websocketAccessTokenRepository, commonDependencies.asyncMessagePublisher, commonDependencies.logger),
        ticker: new WebsocketTickerChannelManagerNewWins(commonDependencies.logger, commonDependencies.asyncMessagePublisher),
      },
    },
  };
};
