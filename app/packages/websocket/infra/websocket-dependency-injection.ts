import type { PublicRuntimeConfig } from "nuxt/schema";
import type { WebsocketAccessTokenRepositoryI } from "../domain/websocket-access-token-repository";
import { WebsocketLeaseRepositoryGirobet } from "./websocket-lease-repository-girobet";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";
import { CreateWebsocketConnection } from "./ui/create-websocket-connection";
import { WebsocketChannelManagerUser } from "./ui/websocket-channel-manager-user";
import { WebsocketChannelManagerNewWins } from "./ui/websocket-channel-manager-new-wins";

export interface WebsocketDependencyInjectionI {
  ui: {
    createWebsocketConnection: CreateWebsocketConnection;
    wsChannelManagers: {
      user: WebsocketChannelManagerUser
      newestWins: WebsocketChannelManagerNewWins
    }
  };
}

export const createWebsocketDependencyInjectionI: (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI) => Promise<WebsocketDependencyInjectionI> = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI) => {
  const websocketLeaseRepository: WebsocketAccessTokenRepositoryI = new WebsocketLeaseRepositoryGirobet({ baseUrl: config.apiBaseUrl }, commonDependencies);

  return {
    ui: {
      createWebsocketConnection: new CreateWebsocketConnection(config.websocketApiBaseUrl, commonDependencies.logger, commonDependencies.asyncMessagePublisher),
      wsChannelManagers: {
        user: new WebsocketChannelManagerUser(websocketLeaseRepository, commonDependencies.asyncMessagePublisher, commonDependencies.logger),
        newestWins: new WebsocketChannelManagerNewWins(commonDependencies.logger)
      }
    },
  };
};
