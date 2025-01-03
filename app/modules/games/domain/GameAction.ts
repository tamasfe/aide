import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export interface GameActionI {
  id: number;
  action: "bet" | "win" | "rollback";
  amount: number;
  currency: components["schemas"]["Currency"];
  createdAt: Date;
  game: {
    name: string;
    id: number;
  };
}
