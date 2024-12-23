import type { PublicRuntimeConfig } from "nuxt/schema";
import type { WebsocketLeaseRepositoryI } from "../domain/websocket-lease-repository";
import { AttemptOpeningWebsocket } from "./ui/attempt-opening-websocket";
import { WebsocketLeaseRepositoryGirobet } from "./websocket-lease-repository-girobet";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface WebsocketDependencyInjectionI {
  ui: {
    attemptOpeningWebsocket: AttemptOpeningWebsocket;
  };
}

export const createWebsocketDependencyInjectionI: (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI) => Promise<WebsocketDependencyInjectionI> = async (config: PublicRuntimeConfig, commonDependencies: CommonDependenciesI) => {
  const websocketLeaseRepository: WebsocketLeaseRepositoryI = new WebsocketLeaseRepositoryGirobet({ baseUrl: config.apiBaseUrl }, commonDependencies);

  return {
    ui: {
      attemptOpeningWebsocket: new AttemptOpeningWebsocket(config.websocketApiBaseUrl, websocketLeaseRepository, commonDependencies.logger, commonDependencies.asyncMessagePublisher),
    },
  };
};
