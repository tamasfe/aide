import type { PublicRuntimeConfig } from "nuxt/schema";
import { SearchGamesPaginating } from "../application/SearchGamesPaginating";
import { SearchGameCategoriesByCategoryGroup } from "../application/SearchGameCategoriesByCategoryGroup";
import { FindGameCompatibilityByIdentifier } from "../application/FindGameCompatibilityById";
import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import type { GameActionsRepositoryI } from "../domain/GameActionsRepository";
import type { GameRatingsRepositoryI } from "../domain/GameRatingsRepository";
import { GamesApiRepositoryDumb } from "./GamesApiRepositoryDumb";
import { GamesApiRepositoryGirobet } from "./GamesApiRepositoryGirobet";
import { SearchGameCategoriesByGroup } from "./ui/SearchGameCategoriesByGroup";
import { GameCategoriesRepositoryDumb } from "./GameCategoriesRepositoryDumb";
import { GameCategoriesRepositoryGirobet } from "./GameCategoriesRepositoryGirobet";
import { FindGameCompatibilityByIdentifierOnGamePage } from "./ui/FindGameCompatibilityByIdOnGamePage";
import { BuildGameSessionIFrameUrl } from "./ui/BuildGameSessionIFrameUrl";
import { SearchGamesByQueryPaginatingOnSearchBar } from "./ui/SearchGamesByQueryPaginatingOnSearchBar";
import { SearchGamesPaginatingOnGrid } from "./ui/SearchGamesPaginatingOnGrid";
import { GameActionsRepositoryDumb } from "./GameActionsRepositoryDumb";
import { GameActionsRepositoryGirobet } from "./GameActionsRepositoryGirobet";
import { SearchGameActionsPaginatingOnCasinoTable } from "./ui/SearchGameActionsPaginatingOnCasinoTable";
import { GameRatingsRepositoryDumb } from "./GameRatingsRepositoryDumb";
import { GameRatingsRepositoryGirobet } from "./GameRatingsRepositoryGirobet";
import { RateGameFromGameFrameVotes } from "./ui/RateGameFromGameFrameVotes";
import { SearchGameRatingFromGameFrameVotes } from "./ui/SearchGameRatingFromGameFrameVotes";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface GamesDependencyInjectionI {
  ui: {
    buildGameSessionIFrameUrl: BuildGameSessionIFrameUrl;
    findGameCompatibilityByIdentifierOnGamePage: FindGameCompatibilityByIdentifierOnGamePage;

    searchGameRatingFromGameFrameVotes: SearchGameRatingFromGameFrameVotes;
    searchGamesPaginatingOnGrid: SearchGamesPaginatingOnGrid;
    searchGamesByQueryPaginatingOnSearchBar: SearchGamesByQueryPaginatingOnSearchBar;
    searchGameCategoriesByGroup: SearchGameCategoriesByGroup;
    searchGameActionsPaginatingOnCasinoTable: SearchGameActionsPaginatingOnCasinoTable;
    rateGameFromGameFrameVotes: RateGameFromGameFrameVotes;
  };
}

export const createGamesDependencyInjection = async (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI): Promise<GamesDependencyInjectionI> => {
  const isServer = import.meta.server;
  const apiBaseUrl = isServer ? publicConfig.games.apiBaseUrlServer : publicConfig.games.apiBaseUrlClient;

  const gamesApiRepository: GamesApiRepositoryI = (() => {
    if (!apiBaseUrl || apiBaseUrl === "") {
      return new GamesApiRepositoryDumb(commonDependencies.logger);
    }

    return new GamesApiRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  const gameRatingsRepository: GameRatingsRepositoryI = (() => {
    if (!apiBaseUrl || apiBaseUrl === "") {
      return new GameRatingsRepositoryDumb(commonDependencies.logger);
    }

    return new GameRatingsRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  const gameCategoriesRepositoryDumb: GameCategoriesRepositoryDumb = (() => {
    if (!apiBaseUrl || apiBaseUrl === "") {
      return new GameCategoriesRepositoryDumb();
    }

    return new GameCategoriesRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  const gameActionsRepository: GameActionsRepositoryI = (() => {
    if (!apiBaseUrl || apiBaseUrl === "") {
      return new GameActionsRepositoryDumb(commonDependencies.logger);
    }

    return new GameActionsRepositoryGirobet({ baseUrl: apiBaseUrl }, commonDependencies);
  })();

  const searchGamesPaginatingQuery = new SearchGamesPaginating(gamesApiRepository);

  return {
    ui: {
      buildGameSessionIFrameUrl: new BuildGameSessionIFrameUrl(publicConfig.games.apiBaseUrlClient || ""),
      findGameCompatibilityByIdentifierOnGamePage: new FindGameCompatibilityByIdentifierOnGamePage(new FindGameCompatibilityByIdentifier(gamesApiRepository), commonDependencies.logger),
      searchGamesPaginatingOnGrid: new SearchGamesPaginatingOnGrid(searchGamesPaginatingQuery, commonDependencies.logger),
      searchGamesByQueryPaginatingOnSearchBar: new SearchGamesByQueryPaginatingOnSearchBar(searchGamesPaginatingQuery, commonDependencies.logger),
      searchGameCategoriesByGroup: new SearchGameCategoriesByGroup(
        new SearchGameCategoriesByCategoryGroup(
          gameCategoriesRepositoryDumb,
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
    },
  };
};
