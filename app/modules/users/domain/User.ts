import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { SupportedLocale } from "~/packages/translation";
import { searchSimilarLocale } from "~/packages/translation/utils";
import type { CamelizeKeys } from "~/utils";

export type User = CamelizeKeys<components["schemas"]["UserResponse"]>;

export interface ExtendedUserI extends User {
  localeSupported: SupportedLocale | null;
  cpf: string | null;
}

export const newExtendedUser = (user: User): ExtendedUserI => {
  return {
    ...user,
    localeSupported: searchSimilarLocale(user.locale),
    cpf: user.documents ? (user.documents["CPF"] as string | null || null) : null,
  };
};
