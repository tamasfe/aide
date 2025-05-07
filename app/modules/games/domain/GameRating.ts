import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export type GameRate = "like" | "dislike";

export type GameRating = CamelizeKeys<components["schemas"]["GameRatingsResponse"]> & {
  ownRating: GameRate | null;
};
