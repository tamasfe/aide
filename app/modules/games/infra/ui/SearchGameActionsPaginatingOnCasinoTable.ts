import type { GameActionsRepositoryI } from "../../domain/GameActionsRepository";
import type { DateTimeFormatterFunctionType, NumberFormatterFunctionType, TranslateFunctionType } from "~/packages/translation";
import type { LoggerI } from "~/packages/logger/Logger";

type GameActionResponse = {
  id: number;
  date: string;
  game: {
    name: string;
    id: number;
  };
  action: string;
  amount: string;
};
export class SearchGameActionsPaginatingOnCasinoTable {
  constructor(
    private gameActionsRepo: GameActionsRepositoryI,
    private logger: LoggerI,
    private t: TranslateFunctionType,
    private n: NumberFormatterFunctionType,
    private d: DateTimeFormatterFunctionType,
  ) {}

  public PAGINATION_SIZE = 25;

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
            case "bet":
            case "win":
            case "rollback":
              return this.t(`game.game_action.action.${gameAction.action}`);
          }
        })();

        return {
          id: gameAction.id,
          date: this.d(gameAction.createdAt.toISOString(), { dateStyle: "medium" }),
          game: {
            name: gameAction.game.name.toUpperCase(),
            id: gameAction.game.id,
          },
          action: action.toUpperCase(),
          amount: this.n(gameAction.amount, { style: "currency", currency: gameAction.currency }),
        };
      }),
    };
  }
}
