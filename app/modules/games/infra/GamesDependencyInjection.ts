import type { PublicRuntimeConfig } from "nuxt/schema";
import { SearchGamesByCategoryPaginating } from "../application/SearchGamesByCategoryPaginating";
import { SearchGameCategoriesByCategoryGroup } from "../application/SearchGameCategoriesByCategoryGroup";
import { FindGameCompatibilityById } from "../application/FindGameCompatibilityById";
import { GamesApiRepositoryDumb } from "./GamesApiRepositoryDumb";
import { GamesApiRepositoryGirobet } from "./GamesApiRepositoryGirobet";
import { FindGameImageSrcByGameId } from "./ui/FindGameImageSrcByGameId";
import { SearchGamesByCategoryPaginatingOnSlider } from "./ui/SearchGamesByCategoryPaginatingOnSlider";
import { SearchGameCategoriesByGroup } from "./ui/SearchGameCategoriesByGroup";
import { GameCategoriesRepositoryDumb } from "./GameCategoriesRepositoryDumb";
import { GameCategoriesRepositoryGirobet } from "./GameCategoriesRepositoryGirobet";
import { FindGameCompatibilityByIdOnGamePage } from "./ui/FindGameCompatibilityByIdOnGamePage";
import { BuildGameSessionIFrameUrl } from "./ui/BuildGameSessionIFrameUrl";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface GamesDependencyInjectionI {
  ui: {
    searchGamesByCategoryPaginatingOnSlider: SearchGamesByCategoryPaginatingOnSlider;
    findGameImageSrcByGameId: FindGameImageSrcByGameId;
    searchGameCategoriesByGroup: SearchGameCategoriesByGroup;
    findGameCompatibilityByIdOnGamePage: FindGameCompatibilityByIdOnGamePage;
    buildGameSessionIFrameUrl: BuildGameSessionIFrameUrl;
  };
}

export const createGamesDependencyInjection = async (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI, requestHeaders?: Record<string, string>): Promise<GamesDependencyInjectionI> => {
  const apiBaseUrl = publicConfig.games.apiBaseUrl;

  if (!apiBaseUrl || apiBaseUrl === "") {
    const gamesApiRepository = new GamesApiRepositoryDumb(commonDependencies.logger);

    const searchGamesByCategoryPaginatingQuery = new SearchGamesByCategoryPaginating(gamesApiRepository);
    const searchGameCategoriesByGroupQuery = new SearchGameCategoriesByCategoryGroup(
      new GameCategoriesRepositoryDumb(),
    );

    return {
      ui: {
        searchGamesByCategoryPaginatingOnSlider: new SearchGamesByCategoryPaginatingOnSlider(searchGamesByCategoryPaginatingQuery, commonDependencies.logger),
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

  const gamesApiRepository = new GamesApiRepositoryGirobet({ baseUrl: apiBaseUrl, headers: requestHeaders, userJurisdiction: publicConfig.genericFixedUserJurisdiction }, commonDependencies.asyncMessagePublisher);

  const searchGamesByCategoryPaginatingQuery = new SearchGamesByCategoryPaginating(
    gamesApiRepository,
  );
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
      searchGamesByCategoryPaginatingOnSlider: new SearchGamesByCategoryPaginatingOnSlider(searchGamesByCategoryPaginatingQuery, commonDependencies.logger),
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
