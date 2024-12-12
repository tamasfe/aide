import type { User } from "./User";
import type { ErrorInvalidCurrentPassword } from "./errors/ErrorInvalidCurrentPassword";
import type { UserSettingsI } from "./UserSettings";
import type { EmptyResult, Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { SupportedLocale } from "~/packages/translation";

export interface AuthenticatedUserRepositoryI {
  searchProfile(): Promise<Result<User | null, InfrastructureError>>;

  searchSettings(): Promise<Result<null | UserSettingsI, InfrastructureError>>;
  updateSettings(settings: {
    locale?: SupportedLocale | null;
    timeZone?: string | null;
    consents?: {
      email?: boolean | null;
      postMail?: boolean | null;
      pushNotification?: boolean | null;
      siteNotification?: boolean | null;
      sms?: boolean | null;
      telephone?: boolean | null;
    };
  }): Promise<EmptyResult<InfrastructureError>>;

  updatePassword(currentPassword: string, newPassword: string): Promise<EmptyResult<ErrorInvalidCurrentPassword | InfrastructureError>>;
}
