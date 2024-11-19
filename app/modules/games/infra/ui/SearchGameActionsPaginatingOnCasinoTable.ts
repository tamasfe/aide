import type { GameActionsRepositoryI } from "../../domain/GameActionsRepository";
import type { DateTimeFormatterFunctionType, NumberFormatterFunctionType, TranslateFunctionType } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchGameActionsPaginatingOnCasinoTable {
  constructor(
    private gameActionsRepo: GameActionsRepositoryI,
    private logger: LoggerI,
    private t: TranslateFunctionType,
    private n: NumberFormatterFunctionType,
    private d: DateTimeFormatterFunctionType,
  ) {}

  public static PAGINATION_SIZE = 10;

  public async handle(): Promise<{
    id: number;
    date: string;
    game: string;
    action: string;
    amount: string;
  }[]> {
    const result = await this.gameActionsRepo.searchPaginating({ type: null }, SearchGameActionsPaginatingOnCasinoTable.PAGINATION_SIZE, 0);

    if (result.isFailure) {
      this.logger.error("SearchGameActionsPaginatingOnCasinoTable failed", result.error);
      return [];
    }

    return result.value.gameActions.map((gameAction) => {
      /**
       * This switch is here to remember to add the translation key when adding new game action.
       * The moment we add one: a type error will appear here and we will remember to add the translation key.
       */
      const action: string = (() => {
        switch (gameAction.action) {
          case "bet":
          case "win":
          case "rollback":
            return this.t(`game.game_action.action.${gameAction.action}`);
        }
      })();

      return {
        id: gameAction.id,
        date: this.d(gameAction.createdAt.toISOString(), { dateStyle: "medium" }),
        game: gameAction.game.name.toUpperCase(),
        action: action.toUpperCase(),
        amount: this.n(gameAction.amount, { style: "currency", currency: gameAction.currency }),
      };
    });
  }
}
