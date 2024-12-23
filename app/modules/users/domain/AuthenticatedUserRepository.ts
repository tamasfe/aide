import type { User } from "./User";
import type { ErrorInvalidCurrentPassword } from "./errors/ErrorInvalidCurrentPassword";
import type { UserSettings } from "./UserSettings";
import type { InvalidCPF } from "./UserCPF";
import type { EmptyResult, Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { SupportedLocale } from "~/packages/translation";

export interface AuthenticatedUserRepositoryI {
  searchProfile(): Promise<Result<User | null, InvalidCPF | InfrastructureError>>;

  searchSettings(): Promise<Result<null | UserSettings, InfrastructureError>>;

  closeAccount: (reason: string | null, currentPassword: string) => Promise<EmptyResult<ErrorInvalidCurrentPassword | InfrastructureError>>;

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
    payment?: {
      pixKeyEmail: null | string;
      pixKeyEvp: null | string;
      pixKeyPhone: null | string;
      pixKeyType: null | "CPF" | "EMAIL" | "PHONE" | "EVP";
    };
  }): Promise<EmptyResult<InfrastructureError>>;

  updatePassword(currentPassword: string, newPassword: string): Promise<EmptyResult<ErrorInvalidCurrentPassword | InfrastructureError>>;
}
