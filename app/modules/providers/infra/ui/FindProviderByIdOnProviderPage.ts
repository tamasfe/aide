import { ErrorProviderNotFound } from "../../domain/ErrorProviderNotFound";
import type { ProvidersRepositoryI } from "../../domain/ProvidersRepository";
import type { LoggerI } from "~/packages/logger/Logger";

export class FindProviderByIdentifierOnProviderPage {
  constructor(private readonly providerRepo: ProvidersRepositoryI, private readonly logger: LoggerI) {}

  async handle(providerIdentifier: string) {
    const result = await this.providerRepo.findByIdentifier(providerIdentifier);

    if (result.isFailure) {
      if (result.error instanceof ErrorProviderNotFound) {
        this.logger.warn("No provider was found for this id", { providerIdentifier });
        return null;
      }

      this.logger.error("Unexpected error while trying to find a provider by its id in the provider/:provider_id page", result.error, { providerIdentifier });
      return null;
    }

    return result.value;
  }
}
