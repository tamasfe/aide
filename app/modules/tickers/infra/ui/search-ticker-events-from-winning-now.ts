import type { TickerChannelEventsRepository } from "../../domain/ticker-channel-events-repository";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchTickerEventsFromWinningNow {
  constructor(
    private readonly tickerChannelEventsRepository: TickerChannelEventsRepository,
    private readonly logger: LoggerI,
  ) {}

  public async handle() {
    const result = await this.tickerChannelEventsRepository.searchNewestWins();
    if (result.isFailure) {
      this.logger.error("Failed to search ticker events from winning now. Tolerating exception and returning empty array", result.error);
      return [];
    }
    return result.value;
  }
}
