import type { PublicRuntimeConfig } from "nuxt/schema";
import { SearchGameCategoriesByCategoryGroup } from "../application/SearchGameCategoriesByCategoryGroup";
import { FindGameCompatibilityByIdentifier } from "../application/FindGameCompatibilityById";
import type { GameSessionsRepositoryI } from "../domain/GameSessionsRepository";
import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import type { GameActionsRepositoryI } from "../domain/GameActionsRepository";
import type { GameRatingsRepositoryI } from "../domain/GameRatingsRepository";
import { GamesApiRepositoryDumb } from "./GamesApiRepositoryDumb";
import { GamesApiRepositoryGirobet } from "./GamesApiRepositoryGirobet";
import { SearchGameCategoriesByGroup } from "./ui/SearchGameCategoriesByGroup";
import { GameCategoriesRepositoryDumb } from "./GameCategoriesRepositoryDumb";
import { GameCategoriesRepositoryGirobet } from "./GameCategoriesRepositoryGirobet";
import { FindGameCompatibilityByIdentifierOnGamePage } from "./ui/FindGameCompatibilityByIdOnGamePage";
import { SearchGamesByQueryPaginatingOnSearchBar } from "./ui/SearchGamesByQueryPaginatingOnSearchBar";
import { ListGamesPaginatingOnGrid } from "./ui/ListGamesPaginatingOnGrid";
import { GameActionsRepositoryDumb } from "./GameActionsRepositoryDumb";
import { GameActionsRepositoryGirobet } from "./GameActionsRepositoryGirobet";
import { SearchGameActionsPaginatingOnCasinoTable } from "./ui/SearchGameActionsPaginatingOnCasinoTable";
import { GameRatingsRepositoryDumb } from "./GameRatingsRepositoryDumb";
import { GameRatingsRepositoryGirobet } from "./GameRatingsRepositoryGirobet";
import { RateGameFromGameFrameVotes } from "./ui/RateGameFromGameFrameVotes";
import { SearchGameRatingFromGameFrameVotes } from "./ui/SearchGameRatingFromGameFrameVotes";
import { GameSessionsRepositoryDumb } from "./GameSessionsRepositoryDumb";
import { GameSessionsRepositoryGirobet } from "./GameSessionsRepositoryGirobet";
import { CreateGameSessionFromGamePage } from "./ui/CreateGameSessionFromGamePage";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";
import { CreateGameSessionDemoFromGamePage } from "./ui/CreateGameSessionDemoFromGamePage";

export interface GamesDependencyInjectionI {
  ui: {
    findGameCompatibilityByIdentifierOnGamePage: FindGameCompatibilityByIdentifierOnGamePage;

    searchGameRatingFromGameFrameVotes: SearchGameRatingFromGameFrameVotes;
    listGamesPaginatingOnGrid: ListGamesPaginatingOnGrid;
    searchGamesByQueryPaginatingOnSearchBar: SearchGamesByQueryPaginatingOnSearchBar;
    searchGameCategoriesByGroup: SearchGameCategoriesByGroup;
    searchGameActionsPaginatingOnCasinoTable: SearchGameActionsPaginatingOnCasinoTable;
    rateGameFromGameFrameVotes: RateGameFromGameFrameVotes;
    createGameSessionFromGamePage: CreateGameSessionFromGamePage;
    createGameSessionDemoFromGamePage: CreateGameSessionDemoFromGamePage;
  };
}

export const createGamesDependencyInjection = async (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI): Promise<GamesDependencyInjectionI> => {
  const apiBaseUrl = useCasinoApiOrigin("api");
  const mode = publicConfig.games.apiMode;

  const gamesApiRepository: GamesApiRepositoryI = (() => {
    if (mode === "dumb") {
      return new GamesApiRepositoryDumb(commonDependencies.logger);
    }

    return new GamesApiRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  const gameRatingsRepository: GameRatingsRepositoryI = (() => {
    if (mode === "dumb") {
      return new GameRatingsRepositoryDumb(commonDependencies.logger);
    }

    return new GameRatingsRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  const gameCategoriesRepository: GameCategoriesRepositoryDumb = (() => {
    if (mode === "dumb") {
      return new GameCategoriesRepositoryDumb();
    }

    return new GameCategoriesRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  const gameActionsRepository: GameActionsRepositoryI = (() => {
    if (mode === "dumb") {
      return new GameActionsRepositoryDumb(commonDependencies.logger);
    }

    return new GameActionsRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  const gameSessionsRepository: GameSessionsRepositoryI = (() => {
    if (mode === "dumb") {
      return new GameSessionsRepositoryDumb(commonDependencies.logger);
    }

    return new GameSessionsRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  return {
    ui: {
      findGameCompatibilityByIdentifierOnGamePage: new FindGameCompatibilityByIdentifierOnGamePage(new FindGameCompatibilityByIdentifier(gamesApiRepository), commonDependencies.logger),
      listGamesPaginatingOnGrid: new ListGamesPaginatingOnGrid(gamesApiRepository, commonDependencies.logger),
      searchGamesByQueryPaginatingOnSearchBar: new SearchGamesByQueryPaginatingOnSearchBar(gamesApiRepository, commonDependencies.logger),
      searchGameCategoriesByGroup: new SearchGameCategoriesByGroup(
        new SearchGameCategoriesByCategoryGroup(
          gameCategoriesRepository,
        ),
        commonDependencies.logger,
      ),
      searchGameActionsPaginatingOnCasinoTable: new SearchGameActionsPaginatingOnCasinoTable(
        gameActionsRepository,
        commonDependencies.logger,
        commonDependencies.translateFunction,
        commonDependencies.numberFormatter,
        commonDependencies.dateTimeFormatter,
      ),
      searchGameRatingFromGameFrameVotes: new SearchGameRatingFromGameFrameVotes(commonDependencies.logger, gameRatingsRepository),
      rateGameFromGameFrameVotes: new RateGameFromGameFrameVotes(commonDependencies.logger, gameRatingsRepository),
      createGameSessionFromGamePage: new CreateGameSessionFromGamePage(gameSessionsRepository, commonDependencies.logger),
      createGameSessionDemoFromGamePage: new CreateGameSessionDemoFromGamePage(gameSessionsRepository, commonDependencies.logger),
    },
  };
};
