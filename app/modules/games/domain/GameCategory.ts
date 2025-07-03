import type { Game } from "./Game";

interface GameCategoryPropsI {
  id: number;
  identifier: string;
  games: Game[] | null;
}

export class GameCategory {
  public static new(props: GameCategoryPropsI): GameCategory {
    return new GameCategory(
      props.id,
      props.identifier,
      props.games,
    );
  }

  public toJSON(): GameCategoryPropsI {
    return {
      id: this.id,
      identifier: this.identifier,
      games: this.games,
    };
  }

  private constructor(
    public readonly id: number,
    public readonly identifier: string,
    public readonly games: Game[] | null,
  ) {
  }
}
