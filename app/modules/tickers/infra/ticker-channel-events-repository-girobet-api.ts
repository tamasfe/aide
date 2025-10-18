import type { TickerChannelEventsRepository } from "../domain/ticker-channel-events-repository";
import { HttpBackendApiError } from "~/packages/http-client/http-backend-api-error";
import { fail, success } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { ApiClient } from "../../../plugins/api-client";

export class TickerChannelEventsRepositoryGirobetApi implements TickerChannelEventsRepository {
  constructor(private readonly apiClient: ApiClient) {}

  public async searchNewestWins() {
    try {
      const { data, error, response } = await this.apiClient.GET("/ticker/{channel}", {
        params: {
          path: {
            channel: "newest_wins" as const,
          },
        },
      });

      if (error) {
        const httpError = HttpBackendApiError.newFromBackendError(error, response);
        return fail(InfrastructureError.newFromError({}, httpError));
      }

      if (data) {
        return success(
          data.filter(event => event.type === "ticker")
            .map(event => camelizeKeys(event)));
      }

      return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")));
    }
    catch (error) {
      return fail(InfrastructureError.newFromUnknownError({}, error));
    }
  }
}
