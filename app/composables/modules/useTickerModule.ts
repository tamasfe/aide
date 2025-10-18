import type { TickerChannelEventsRepository } from "~/modules/tickers/domain/ticker-channel-events-repository";
import { TickerChannelEventsRepositoryGirobetApi } from "~/modules/tickers/infra/ticker-channel-events-repository-girobet-api";
import { SearchTickerEventsFromWinningNow } from "~/modules/tickers/infra/ui/search-ticker-events-from-winning-now";

export default function () {
  const { $apiClient } = useNuxtApp();
  const logger = useLogger();

  const tickersRepository: TickerChannelEventsRepository = (() => {
    return new TickerChannelEventsRepositoryGirobetApi($apiClient);
    // switch ("api") {
    //   case "mock":
    //     return new TickerChannelEventsRepositoryDumb();
    //   default:
    //     return new TickerChannelEventsRepositoryGirobetApi($apiClient);
    // }
  })();

  return {
    ui: {
      searchTickerEventsFromWinningNow: new SearchTickerEventsFromWinningNow(
        tickersRepository,
        logger,
      ),
    },
  };
}
