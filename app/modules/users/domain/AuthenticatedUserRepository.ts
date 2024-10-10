import type { User } from "./User";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface AuthenticatedUserRepositoryI {
  searchProfile(): Promise<Result<User | null, InfrastructureError>>;
}
