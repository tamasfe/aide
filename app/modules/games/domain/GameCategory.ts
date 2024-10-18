interface GameCategoryPropsI {
  id: number;
  identifier: string;
}

export class GameCategory {
  public static new(props: GameCategoryPropsI): GameCategory {
    return new GameCategory(props);
  }

  public readonly id: number;
  public readonly identifier: string;

  public toJSON(): GameCategoryPropsI {
    return {
      id: this.id,
      identifier: this.identifier,
    };
  }

  private constructor(props: GameCategoryPropsI) {
    this.id = props.id;
    this.identifier = props.identifier;
  }
}
