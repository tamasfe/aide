import type { GameActionsRepositoryI } from "../../domain/GameActionsRepository";
import type { DateTimeFormatterFunctionType, NumberFormatterFunctionType, TranslateFunctionType } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";

/**
 * We do not simply return the GameAction domain object as the "action", "ampount", and "date" need to be formatted through i18n.
 */
type GameActionResponse = {
  id: number;
  date: string;
  game: {
    name: string;
    identifier: string;
  };
  action: string;
  amount: number;
  amountBonus: number;
  currency: string;
};

export class SearchGameActionsPaginatingOnCasinoTable {
  constructor(
    private gameActionsRepo: GameActionsRepositoryI,
    private logger: LoggerI,
    private t: TranslateFunctionType,
    private n: NumberFormatterFunctionType,
    private d: DateTimeFormatterFunctionType,
  ) {}

  public PAGINATION_SIZE = 24;

  public async handle(pageIndex: number): Promise<{
    gameActions: GameActionResponse[];
    pageIndex: number;
    pageSize: number;
    totalItems: number;
  }> {
    const pageSize = this.PAGINATION_SIZE;

    const result = await this.gameActionsRepo.searchPaginating({ type: null }, pageSize, pageIndex * pageSize);

    if (result.isFailure) {
      this.logger.error("SearchGameActionsPaginatingOnCasinoTable failed", result.error);
      return {
        gameActions: [],
        pageIndex,
        pageSize,
        totalItems: 0,
      };
    }

    return {
      pageIndex,
      pageSize,
      totalItems: result.value.pagination.totalItems,
      gameActions: result.value.gameActions.map((gameAction) => {
      /**
       * This switch is here to remember to add the translation key when adding new game action.
       * The moment we add one: a type error will appear here and we will remember to add the translation key.
       */
        const action: string = (() => {
          switch (gameAction.action) {
            case "wager":
            case "win":
              return this.t(`game.game_action.action.${gameAction.action}`);
          }
        })();

        return {
          id: gameAction.id,
          date: this.d(new Date(gameAction.createdAt).toISOString(), { dateStyle: "medium" }),
          game: {
            name: gameAction.gameName.toUpperCase(),
            identifier: gameAction.gameIdentifier,
          },
          action: action.toUpperCase(),
          amount: gameAction.amountLocked + gameAction.amountUnlocked,
          amountBonus: gameAction.amountBonus,
          currency: gameAction.currency,
        };
      }),
    };
  }
}
