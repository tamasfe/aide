import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { Win } from "~/types/wins";

export abstract class TickerChannelEventsRepository {
  abstract searchNewestWins(): Promise<Result<Win[], InfrastructureError>>;
}
