import type { WalletRepositoryI } from "../domain/WalletRepository";
import { ErrorNoAuthenticatedWalletsFound } from "../domain/ErrorNoAuthenticatedWalletsFound";
import type { WalletI } from "../domain/Wallet";
import { WalletCurrencies, type WalletCurrency } from "../domain/WalletCurrency";
import { ErrorCurrencyNotRecognized } from "../domain/ErrorCurrencyNotRecognized";
import { ErrorInvalidBalance } from "../domain/ErrorInvalidBalance";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class WalletsRepositoryGirobet implements WalletRepositoryI {
  constructor(clientOptions: { baseUrl: string; headers?: Record<string, string>; userJurisdiction?: string }, asyncMessagePublisher: AsyncMessagePublisherI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, asyncMessagePublisher);
  }

  public async findAuthenticated(): Promise<Result<WalletI[], InfrastructureError | ErrorCurrencyNotRecognized | ErrorNoAuthenticatedWalletsFound | ErrorInvalidBalance>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/user/balance", {});

      if (data) {
        const wallets: WalletI[] = [];
        for (const wallet of data) {
          const currency = String(wallet.currency);
          if (!WalletCurrencies.includes(currency as WalletCurrency)) {
            return fail(
              new ErrorCurrencyNotRecognized(currency, { wallet }),
            );
          }

          const balance = Number(wallet.balance);
          if (Number.isNaN(balance)) {
            return fail(
              new ErrorInvalidBalance(wallet.balance, { wallet }),
            );
          }

          wallets.push({
            balance: wallet.balance,
            balanceValue: balance,
            currency: currency as WalletCurrency,
          });
        }

        return success(wallets);
      }

      if (error) {
        if (error.code === "WALLET_NOT_FOUND") {
          return fail(
            new ErrorNoAuthenticatedWalletsFound({}),
          );
        }
        return fail(
          InfrastructureError.newFromError({}, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({}, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({}, error),
      );
    }
  }

  private readonly apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
