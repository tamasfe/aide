import type { User } from "./User";
import type { ErrorInvalidCurrentPassword } from "./errors/ErrorInvalidCurrentPassword";
import type { EmptyResult, Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { SupportedLocale } from "~/packages/translation";

export interface AuthenticatedUserRepositoryI {
  searchProfile(): Promise<Result<User | null, InfrastructureError>>;

  updateSettings(settings: {
    locale?: SupportedLocale;
  }): Promise<EmptyResult<InfrastructureError>>;

  updatePassword(currentPassword: string, newPassword: string): Promise<EmptyResult<ErrorInvalidCurrentPassword | InfrastructureError>>;
}
