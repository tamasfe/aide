import type { TickerChannelEventsRepository } from "../domain/ticker-channel-events-repository";
import { success } from "~/packages/result";

export class TickerChannelEventsRepositoryDumb implements TickerChannelEventsRepository {
  async searchNewestWins() {
    return success([
      {
        id: "dummy_event_123",
        timestamp: new Date("2023-10-01T12:00:00Z").toISOString(),
        type: "ticker" as const,
        data: {
          type: "winning_now" as const,
          data: {
            amount: 123.45,
            currency: "EUR" as const,
            game: {
              identifier: "dummy_game_123",
              name: "Dummy Game",
            },
            userNickname: "yellow_banana",
          },
        },
      },
    ]);
  }
}
