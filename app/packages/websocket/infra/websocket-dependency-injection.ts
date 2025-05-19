import type { PublicRuntimeConfig } from "nuxt/schema";
import type { WebsocketAccessTokenRepositoryI } from "../domain/websocket-access-token-repository";
import { WebsocketLeaseRepositoryGirobet } from "./websocket-lease-repository-girobet";
import { CreateWebsocketConnection } from "./ui/create-websocket-connection";
import { WebsocketChannelManagerUser } from "./ui/websocket-channel-manager-user";
import { WebsocketChannelManagerNewWins } from "./ui/websocket-channel-manager-new-wins";
import { WebsocketChannelManagerTracker } from "./ui/websocket-channel-manager-tracker";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface WebsocketDependencyInjectionI {
  ui: {
    createWebsocketConnection: CreateWebsocketConnection;
    wsChannelManagers: {
      user: WebsocketChannelManagerUser;
      newestWins: WebsocketChannelManagerNewWins;
      tracker: WebsocketChannelManagerTracker;
    };
  };
}

export const createWebsocketDependencyInjectionI: (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI) => Promise<WebsocketDependencyInjectionI> = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI) => {
  const websocketLeaseRepository: WebsocketAccessTokenRepositoryI = new WebsocketLeaseRepositoryGirobet({ baseUrl: config.apiBaseUrlClient }, commonDependencies);

  return {
    ui: {
      createWebsocketConnection: new CreateWebsocketConnection(config.websocketApiBaseUrl, commonDependencies.logger, commonDependencies.asyncMessagePublisher),
      wsChannelManagers: {
        user: new WebsocketChannelManagerUser(websocketLeaseRepository, commonDependencies.asyncMessagePublisher, commonDependencies.logger),
        newestWins: new WebsocketChannelManagerNewWins(commonDependencies.logger, commonDependencies.asyncMessagePublisher),
        tracker: new WebsocketChannelManagerTracker(commonDependencies.logger, commonDependencies.asyncMessagePublisher),
      },
    },
  };
};
