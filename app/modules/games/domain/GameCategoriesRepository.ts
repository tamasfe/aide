import type { GameCategory } from "./GameCategory";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface GameCategoriesRepositoryI {
  searchByGroup(categoryGroup: string): Promise<Result<GameCategory[], InfrastructureError>>;
}
