export type GameRate = "like" | "dislike";

export interface GameRatingI {
  id: number;
  rating: GameRate | null;
  likes: number;
  dislikes: number;
}

export class GameRating {
  public static new(props: GameRatingI) {
    return new GameRating(
      props.id,
      props.rating,
      props.likes,
      props.dislikes,
    );
  }

  public toJSON(): GameRatingI {
    return {
      id: this.id,
      rating: this.rating,
      likes: this.likes,
      dislikes: this.dislikes,
    };
  }

  private constructor(
    public readonly id: number,
    public readonly rating: GameRate | null,
    public readonly likes: number,
    public readonly dislikes: number,
  ) {}
}
