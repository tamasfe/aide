import type { GameSessionsRepositoryI } from "~/modules/games/domain/GameSessionsRepository";
import type { GamesApiRepositoryI } from "~/modules/games/domain/GamesApiRepository";
import type { GameActionsRepositoryI } from "~/modules/games/domain/GameActionsRepository";
import type { GameRatingsRepositoryI } from "~/modules/games/domain/GameRatingsRepository";
import { GamesApiRepositoryDumb } from "~/modules/games/infra/GamesApiRepositoryDumb";
import { GamesApiRepositoryGirobet } from "~/modules/games/infra/GamesApiRepositoryGirobet";
import { SearchGameCategoriesByGroup } from "~/modules/games/infra/ui/SearchGameCategoriesByGroup";
import { GameCategoriesRepositoryDumb } from "~/modules/games/infra/GameCategoriesRepositoryDumb";
import { GameCategoriesRepositoryGirobet } from "~/modules/games/infra/GameCategoriesRepositoryGirobet";
import { FindGameCompatibilityByIdentifierOnGamePage } from "~/modules/games/infra/ui/FindGameCompatibilityByIdOnGamePage";
import { SearchGamesByQueryPaginatingOnSearchBar } from "~/modules/games/infra/ui/SearchGamesByQueryPaginatingOnSearchBar";
import { ListGamesPaginatingOnGrid } from "~/modules/games/infra/ui/ListGamesPaginatingOnGrid";
import { GameActionsRepositoryDumb } from "~/modules/games/infra/GameActionsRepositoryDumb";
import { GameActionsRepositoryGirobet } from "~/modules/games/infra/GameActionsRepositoryGirobet";
import { SearchGameActionsPaginatingOnCasinoTable } from "~/modules/games/infra/ui/SearchGameActionsPaginatingOnCasinoTable";
import { GameRatingsRepositoryDumb } from "~/modules/games/infra/GameRatingsRepositoryDumb";
import { GameRatingsRepositoryGirobet } from "~/modules/games/infra/GameRatingsRepositoryGirobet";
import { RateGameFromGameFrameVotes } from "~/modules/games/infra/ui/RateGameFromGameFrameVotes";
import { SearchGameRatingFromGameFrameVotes } from "~/modules/games/infra/ui/SearchGameRatingFromGameFrameVotes";
import { GameSessionsRepositoryDumb } from "~/modules/games/infra/GameSessionsRepositoryDumb";
import { GameSessionsRepositoryGirobet } from "~/modules/games/infra/GameSessionsRepositoryGirobet";
import { CreateGameSessionFromGamePage } from "~/modules/games/infra/ui/CreateGameSessionFromGamePage";
import { CreateGameSessionDemoFromGamePage } from "~/modules/games/infra/ui/CreateGameSessionDemoFromGamePage";
import { SearchGameCategoriesByCategoryGroup } from "~/modules/games/application/SearchGameCategoriesByCategoryGroup";

import { FindGameCompatibilityByIdentifier } from "../../modules/games/application/FindGameCompatibilityById";

export default function () {
  const runtimeConfig = useRuntimeConfig();
  const { $apiClient, $i18n } = useNuxtApp();
  const logger = useLogger();

  const gamesApiRepository: GamesApiRepositoryI = (() => {
    switch (runtimeConfig.public.games?.apiMode) {
      case "mock":
        return new GamesApiRepositoryDumb(logger);
      default:
        return new GamesApiRepositoryGirobet($apiClient);
    }
  })();

  const gameRatingsRepository: GameRatingsRepositoryI = (() => {
    switch (runtimeConfig.public.games?.apiMode) {
      case "mock":
        return new GameRatingsRepositoryDumb(logger);
      default:
        return new GameRatingsRepositoryGirobet($apiClient);
    }
  })();

  const gameCategoriesRepository = (() => {
    switch (runtimeConfig.public.games?.apiMode) {
      case "mock":
        return new GameCategoriesRepositoryDumb();
      default:
        return new GameCategoriesRepositoryGirobet($apiClient);
    }
  })();

  const gameActionsRepository: GameActionsRepositoryI = (() => {
    switch (runtimeConfig.public.games?.apiMode) {
      case "mock":
        return new GameActionsRepositoryDumb(logger);
      default:
        return new GameActionsRepositoryGirobet($apiClient);
    }
  })();

  const gameSessionsRepository: GameSessionsRepositoryI = (() => {
    switch (runtimeConfig.public.games?.apiMode) {
      case "mock":
        return new GameSessionsRepositoryDumb(logger);
      default:
        return new GameSessionsRepositoryGirobet($apiClient);
    }
  })();

  return {
    ui: {
      findGameCompatibilityByIdentifierOnGamePage: new FindGameCompatibilityByIdentifierOnGamePage(
        new FindGameCompatibilityByIdentifier(gamesApiRepository),
        logger,
      ),
      listGamesPaginatingOnGrid: new ListGamesPaginatingOnGrid(
        gamesApiRepository,
        logger,
      ),
      searchGamesByQueryPaginatingOnSearchBar: new SearchGamesByQueryPaginatingOnSearchBar(
        gamesApiRepository,
        logger,
      ),
      searchGameCategoriesByGroup: new SearchGameCategoriesByGroup(
        new SearchGameCategoriesByCategoryGroup(gameCategoriesRepository),
        logger,
      ),
      searchGameActionsPaginatingOnCasinoTable: new SearchGameActionsPaginatingOnCasinoTable(
        gameActionsRepository,
        logger,
        $i18n.t,
        $i18n.n,
        $i18n.d,
      ),
      searchGameRatingFromGameFrameVotes: new SearchGameRatingFromGameFrameVotes(
        logger,
        gameRatingsRepository,
      ),
      rateGameFromGameFrameVotes: new RateGameFromGameFrameVotes(
        logger,
        gameRatingsRepository,
      ),
      createGameSessionFromGamePage: new CreateGameSessionFromGamePage(
        gameSessionsRepository,
        logger,
      ),
      createGameSessionDemoFromGamePage: new CreateGameSessionDemoFromGamePage(
        gameSessionsRepository,
        logger,
      ),
    },
  };
}
