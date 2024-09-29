import { SearchGamesByCategoryPaginating } from "../application/SearchGamesByCategoryPaginating";
import { GamesApiRepositoryDumb } from "./GamesApiRepositoryDumb";
import { FindGameImageSrcByGameId } from "./ui/FindGameImageSrcByGameId";
import { SearchGamesByCategoryPaginatingOnHorizontalSlider } from "./ui/SearchGamesByCategoryPaginatingOnHorizontalSlider";

export interface GamesDependencyInjectionI {
  ui: {
    searchGamesByCategoryPaginatingOnHorizontalSlider: SearchGamesByCategoryPaginatingOnHorizontalSlider;
    findGameImageSrcByGameId: FindGameImageSrcByGameId;
  };
}

export const createGamesDependencyInjection = async (): Promise<GamesDependencyInjectionI> => {
  const searchGamesByCategoryPaginating = new SearchGamesByCategoryPaginating(
    new GamesApiRepositoryDumb(),
  );

  return {
    ui: {
      searchGamesByCategoryPaginatingOnHorizontalSlider: new SearchGamesByCategoryPaginatingOnHorizontalSlider(searchGamesByCategoryPaginating),
      findGameImageSrcByGameId: new FindGameImageSrcByGameId(),
    },
  };
};
