import type { PublicRuntimeConfig } from "nuxt/schema";
import { SearchGamesPaginating } from "../application/SearchGamesPaginating";
import { SearchGameCategoriesByCategoryGroup } from "../application/SearchGameCategoriesByCategoryGroup";
import { FindGameCompatibilityById } from "../application/FindGameCompatibilityById";
import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import { GamesApiRepositoryDumb } from "./GamesApiRepositoryDumb";
import { GamesApiRepositoryGirobet } from "./GamesApiRepositoryGirobet";
import { FindGameImageSrcByGameId } from "./ui/FindGameImageSrcByGameId";
import { SearchGamesByCategoryPaginatingOnSlider } from "./ui/SearchGamesByCategoryPaginatingOnSlider";
import { SearchGameCategoriesByGroup } from "./ui/SearchGameCategoriesByGroup";
import { GameCategoriesRepositoryDumb } from "./GameCategoriesRepositoryDumb";
import { GameCategoriesRepositoryGirobet } from "./GameCategoriesRepositoryGirobet";
import { FindGameCompatibilityByIdOnGamePage } from "./ui/FindGameCompatibilityByIdOnGamePage";
import { BuildGameSessionIFrameUrl } from "./ui/BuildGameSessionIFrameUrl";
import { SearchGamesByQueryPaginatingOnSearchBar } from "./ui/SearchGamesByQueryPaginatingOnSearchBar";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface GamesDependencyInjectionI {
  ui: {
    searchGamesByCategoryPaginatingOnSlider: SearchGamesByCategoryPaginatingOnSlider;
    searchGamesByQueryPaginatingOnSearchBar: SearchGamesByQueryPaginatingOnSearchBar;
    findGameImageSrcByGameId: FindGameImageSrcByGameId;
    searchGameCategoriesByGroup: SearchGameCategoriesByGroup;
    findGameCompatibilityByIdOnGamePage: FindGameCompatibilityByIdOnGamePage;
    buildGameSessionIFrameUrl: BuildGameSessionIFrameUrl;
  };
}

export const createGamesDependencyInjection = async (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, requestHeaders?: Record<string, string>): Promise<GamesDependencyInjectionI> => {
  const isServer = import.meta.server;
  const apiBaseUrl = isServer ? publicConfig.games.apiBaseUrlServer : publicConfig.games.apiBaseUrlClient;

  const gamesApiRepository: GamesApiRepositoryI = (() => {
    if (!apiBaseUrl || apiBaseUrl === "") {
      return new GamesApiRepositoryDumb(commonDependencies.logger);
    }

    return new GamesApiRepositoryGirobet({ baseUrl: apiBaseUrl, headers: requestHeaders, userJurisdiction: publicConfig.genericFixedUserJurisdiction }, commonDependencies.asyncMessagePublisher);
  })();

  const searchGamesPaginatingQuery = new SearchGamesPaginating(gamesApiRepository);

  if (!apiBaseUrl || apiBaseUrl === "") {
    const searchGameCategoriesByGroupQuery = new SearchGameCategoriesByCategoryGroup(
      new GameCategoriesRepositoryDumb(),
    );

    return {
      ui: {
        searchGamesByCategoryPaginatingOnSlider: new SearchGamesByCategoryPaginatingOnSlider(searchGamesPaginatingQuery, commonDependencies.logger),
        searchGamesByQueryPaginatingOnSearchBar: new SearchGamesByQueryPaginatingOnSearchBar(searchGamesPaginatingQuery, commonDependencies.logger),
        findGameImageSrcByGameId: new FindGameImageSrcByGameId(apiBaseUrl || ""),
        searchGameCategoriesByGroup: new SearchGameCategoriesByGroup(
          searchGameCategoriesByGroupQuery,
          commonDependencies.logger,
        ),
        findGameCompatibilityByIdOnGamePage: new FindGameCompatibilityByIdOnGamePage(new FindGameCompatibilityById(gamesApiRepository), commonDependencies.logger),
        buildGameSessionIFrameUrl: new BuildGameSessionIFrameUrl(apiBaseUrl || ""),
      },
    };
  }

  const searchGameCategoriesByGroupQuery = new SearchGameCategoriesByCategoryGroup(
    new GameCategoriesRepositoryGirobet({
      baseUrl: apiBaseUrl,
      headers: requestHeaders,
      userJurisdiction: publicConfig.genericFixedUserJurisdiction,
    },
    commonDependencies.asyncMessagePublisher),
  );

  return {
    ui: {
      searchGamesByCategoryPaginatingOnSlider: new SearchGamesByCategoryPaginatingOnSlider(searchGamesPaginatingQuery, commonDependencies.logger),
      searchGamesByQueryPaginatingOnSearchBar: new SearchGamesByQueryPaginatingOnSearchBar(searchGamesPaginatingQuery, commonDependencies.logger),
      findGameImageSrcByGameId: new FindGameImageSrcByGameId(apiBaseUrl || ""),
      searchGameCategoriesByGroup: new SearchGameCategoriesByGroup(
        searchGameCategoriesByGroupQuery,
        commonDependencies.logger,
      ),
      findGameCompatibilityByIdOnGamePage: new FindGameCompatibilityByIdOnGamePage(new FindGameCompatibilityById(gamesApiRepository), commonDependencies.logger),
      buildGameSessionIFrameUrl: new BuildGameSessionIFrameUrl(apiBaseUrl || ""),
    },
  };
};
