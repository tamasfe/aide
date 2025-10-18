import type { GameIdentifier } from "../domain/Game";
import type { GameSessionsRepositoryI } from "../domain/GameSessionsRepository";
import { ErrorGameNotAccessible } from "../domain/ErrorGameNotAccessible";
import { ErrorGameNotFound } from "../domain/ErrorGameNotFound";
import { ErrorGameHasNoDemo } from "../domain/ErrorGameHasNoDemo";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import { ErrorInsufficientFunds } from "~/modules/wallet/domain/ErrorInsufficientFunds";
import { ErrorWalletNotFound } from "~/modules/wallet/domain/ErrorWalletNotFound";
import { ErrorUnauthorized } from "~/modules/users/domain/errors/ErrorUnauthorized";
import { HttpBackendApiError } from "~/packages/http-client/http-backend-api-error";
import { fail, success } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { ApiClient } from "../../../plugins/api-client";

export class GameSessionsRepositoryGirobet implements GameSessionsRepositoryI {
  constructor(private readonly apiClient: ApiClient) {}

  public async create(gameIdentifier: GameIdentifier, currency: WalletCurrency, clientType: "desktop" | "mobile"): ReturnType<GameSessionsRepositoryI["create"]> {
    const metadata: Record<string, unknown> = {
      gameIdentifier: gameIdentifier.value,
      clientType,
      currency,
    };

    try {
      const { data, error, response } = await this.apiClient.POST("/game/{provider_slug}/{game_slug}/session", {
        params: {
          path: {
            provider_slug: gameIdentifier.providerSlug,
            game_slug: gameIdentifier.gameSlug,
          },
          // @ts-expect-error Generated types are wrong: the query params are not optional. Talk with Daniel so the types align with the behaviour.
          query: {
            currency,
            client_type: clientType,
          },
        },
        body: {
          client_type: clientType,
          currency,
        },
      });

      if (data) {
        return success({ url: data.url });
      }

      if (error) {
        switch (error.code) {
          case "INSUFFICIENT_FUNDS":
            return fail(ErrorInsufficientFunds.new(metadata));
          case "UNAUTHORIZED":
            return fail(new ErrorUnauthorized("create-game-session"));
          case "GAME_NOT_FOUND":
            return fail(ErrorGameNotFound.newFromGameIdentifier(gameIdentifier.value));
          case "WALLET_NOT_FOUND":
            return fail(new ErrorWalletNotFound(metadata));
          case "GAME_NOT_ACCESSIBLE":
            return fail(new ErrorGameNotAccessible(gameIdentifier.value));
        }

        return fail(
          InfrastructureError.newFromError(
            metadata,
            HttpBackendApiError.newFromBackendError(error, response),
          ),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError(
          metadata,
          new Error("Unexpected scenario: library did not return data nor error. This should never happen"),
        ),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError(metadata, error),
      );
    }
  }

  public async createDemo(gameIdentifier: GameIdentifier, clientType: "desktop" | "mobile", language: string): ReturnType<GameSessionsRepositoryI["createDemo"]> {
    const metadata: Record<string, unknown> = {
      gameIdentifier: gameIdentifier.value,
      clientType,
      language,
    };

    try {
      const { data, error, response } = await this.apiClient.POST("/game/{provider_slug}/{game_slug}/demo", {
        params: {
          path: {
            provider_slug: gameIdentifier.providerSlug,
            game_slug: gameIdentifier.gameSlug,
          },
          // @ts-expect-error Generated types are wrong: the query params are not optional. Talk with Daniel so the types align with the behaviour.
          query: {
            language,
            client_type: clientType,
          },
        },
        body: {
          client_type: clientType,
          language,
        },
      });

      if (data) {
        return success({ url: data.url });
      }

      if (error) {
        switch (error.code) {
          case "GAME_HAS_NO_DEMO":
            return fail(new ErrorGameHasNoDemo(gameIdentifier.value));
          case "GAME_NOT_ACCESSIBLE":
            return fail(new ErrorGameNotAccessible(gameIdentifier.value));
          case "GAME_NOT_FOUND":
            return fail(ErrorGameNotFound.newFromGameIdentifier(gameIdentifier.value));
        }

        return fail(
          InfrastructureError.newFromError(
            metadata,
            HttpBackendApiError.newFromBackendError(error, response),
          ),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError(
          metadata,
          new Error("Unexpected scenario: library did not return data nor error. This should never happen"),
        ),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError(metadata, error),
      );
    }
  }
}
