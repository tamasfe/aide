import type { FindProviderById } from "../../application/FindProviderById";
import { ErrorProviderNotFound } from "../../domain/ErrorProviderNotFound";
import type { LoggerI } from "~/packages/logger/Logger";

export class FindProviderByIdOnProviderPage {
  constructor(private readonly query: FindProviderById, private readonly logger: LoggerI) {}

  async handle(providerId: number) {
    const result = await this.query.handle(providerId);

    if (result.isFailure) {
      if (result.error instanceof ErrorProviderNotFound) {
        this.logger.warn("No provider was found for this id", { providerId });
        return null;
      }

      this.logger.error("Unexpected error while trying to find a provider by its id in the provider/:provider_id page", result.error, { providerId });
      return null;
    }

    return result.value;
  }
}
