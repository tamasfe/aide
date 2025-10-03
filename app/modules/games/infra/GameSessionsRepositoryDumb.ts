import type { GameIdentifier } from "../domain/Game";
import type { GameSessionsRepositoryI } from "../domain/GameSessionsRepository";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { LoggerI } from "~/packages/logger/Logger";
import { success } from "~/packages/result";

export class GameSessionsRepositoryDumb implements GameSessionsRepositoryI {
  constructor(private readonly logger: LoggerI) {}

  public async create(gameIdentifier: GameIdentifier, currency: WalletCurrency, clientType: "desktop" | "mobile"): ReturnType<GameSessionsRepositoryI["create"]> {
    this.logger.debug("GameSessionsRepositoryDumb:create", {
      gameIdentifier: gameIdentifier.toJSON(),
      currency,
      clientType,
    });

    return success({
      url: this.buildUrl(gameIdentifier, "session", {
        client_type: clientType,
        currency,
      }),
    });
  }

  public async createDemo(gameIdentifier: GameIdentifier, clientType: "desktop" | "mobile", language: string): ReturnType<GameSessionsRepositoryI["createDemo"]> {
    this.logger.debug("GameSessionsRepositoryDumb:createDemo", {
      gameIdentifier: gameIdentifier.toJSON(),
      clientType,
      language,
    });

    return success({
      url: this.buildUrl(gameIdentifier, "demo", {
        client_type: clientType,
        language,
      }),
    });
  }

  private buildUrl(gameIdentifier: GameIdentifier, endpoint: "session" | "demo", query: Record<string, string>): string {
    const searchParams = new URLSearchParams(query);
    const baseUrl = new URL(`/game/${gameIdentifier.value}/${endpoint}`, "https://demo.girobet.test");
    baseUrl.search = searchParams.toString();
    return baseUrl.toString();
  }
}
