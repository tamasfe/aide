import { SearchGamesByCategoryPaginating } from "../application/SearchGamesByCategoryPaginating";
import { GamesApiRepositoryDumb } from "./GamesApiRepositoryDumb";
import { GamesApiRepositoryGirobet } from "./GamesApiRepositoryGirobet";
import { FindGameImageSrcByGameId } from "./ui/FindGameImageSrcByGameId";
import { SearchGamesByCategoryPaginatingOnHorizontalSlider } from "./ui/SearchGamesByCategoryPaginatingOnHorizontalSlider";

export interface GamesDependencyInjectionI {
  ui: {
    searchGamesByCategoryPaginatingOnHorizontalSlider: SearchGamesByCategoryPaginatingOnHorizontalSlider;
    findGameImageSrcByGameId: FindGameImageSrcByGameId;
  };
}

export const createGamesDependencyInjection = async (apiBaseUrl: string | undefined): Promise<GamesDependencyInjectionI> => {
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
    new GamesApiRepositoryGirobet(apiBaseUrl),
  );

  return {
    ui: {
      searchGamesByCategoryPaginatingOnHorizontalSlider: new SearchGamesByCategoryPaginatingOnHorizontalSlider(searchGamesByCategoryPaginatingQuery),
      findGameImageSrcByGameId: new FindGameImageSrcByGameId(apiBaseUrl || ""),
    },
  };
};
