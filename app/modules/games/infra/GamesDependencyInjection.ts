import type { PublicRuntimeConfig } from "nuxt/schema";
import { SearchGamesByCategoryPaginating } from "../application/SearchGamesByCategoryPaginating";
import { GamesApiRepositoryDumb } from "./GamesApiRepositoryDumb";
import { GamesApiRepositoryGirobet } from "./GamesApiRepositoryGirobet";
import { FindGameImageSrcByGameId } from "./ui/FindGameImageSrcByGameId";
import { SearchGamesByCategoryPaginatingOnHorizontalSlider } from "./ui/SearchGamesByCategoryPaginatingOnHorizontalSlider";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export interface GamesDependencyInjectionI {
  ui: {
    searchGamesByCategoryPaginatingOnHorizontalSlider: SearchGamesByCategoryPaginatingOnHorizontalSlider;
    findGameImageSrcByGameId: FindGameImageSrcByGameId;
  };
}

export const createGamesDependencyInjection = async (publicConfig: PublicRuntimeConfig, commonDependencies: CommonDependenciesI): Promise<GamesDependencyInjectionI> => {
  const apiBaseUrl = publicConfig.games.apiBaseUrl;

  if (!apiBaseUrl || apiBaseUrl === "") {
    const searchGamesByCategoryPaginatingQuery = new SearchGamesByCategoryPaginating(
      new GamesApiRepositoryDumb(),
    );

    return {
      ui: {
        searchGamesByCategoryPaginatingOnHorizontalSlider: new SearchGamesByCategoryPaginatingOnHorizontalSlider(searchGamesByCategoryPaginatingQuery),
        findGameImageSrcByGameId: new FindGameImageSrcByGameId(apiBaseUrl || ""),
      },
    };
  }

  const searchGamesByCategoryPaginatingQuery = new SearchGamesByCategoryPaginating(
    new GamesApiRepositoryGirobet(apiBaseUrl, commonDependencies.asyncMessagePublisher),
  );

  return {
    ui: {
      searchGamesByCategoryPaginatingOnHorizontalSlider: new SearchGamesByCategoryPaginatingOnHorizontalSlider(searchGamesByCategoryPaginatingQuery),
      findGameImageSrcByGameId: new FindGameImageSrcByGameId(apiBaseUrl || ""),
    },
  };
};
