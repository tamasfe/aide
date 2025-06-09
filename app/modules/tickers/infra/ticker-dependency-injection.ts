import type { PublicRuntimeConfig } from "nuxt/schema";
import type { TickerChannelEventsRepository } from "../domain/ticker-channel-events-repository";
import { TickerChannelEventsRepositoryDumb } from "./ticker-channel-events-repository-dumb";
import { TickerChannelEventsRepositoryGirobetApi } from "./ticker-channel-events-repository-girobet-api";
import { SearchTickerEventsFromWinningNow } from "./ui/search-ticker-events-from-winning-now";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export const createTickersDependencyInjection = async (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI) => {
  const isServer = import.meta.server;
  const apiBaseUrl = isServer ? publicConfig.apiBaseUrlServer : publicConfig.apiBaseUrlClient;

  const tickersRepository: TickerChannelEventsRepository = (() => {
    if (!apiBaseUrl || apiBaseUrl === "") {
      return new TickerChannelEventsRepositoryDumb();
    }

    return new TickerChannelEventsRepositoryGirobetApi({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  return {
    ui: {
      searchTickerEventsFromWinningNow: new SearchTickerEventsFromWinningNow(tickersRepository, commonDependencies.logger),
    },
  };
};
