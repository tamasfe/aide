import type { ErrorInvalidUserTelephone } from "./UserTelephone";
import { UserTelephone } from "./UserTelephone";
import { success, type Result } from "~/packages/result";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { SupportedLocale } from "~/packages/translation";
import { searchSimilarLocale } from "~/packages/translation/utils";
import type { CamelizeKeys } from "~/utils";

export type User = CamelizeKeys<components["schemas"]["UserResponse"]>;

export interface ExtendedUserI extends User {
  localeSupported: SupportedLocale | null;
  cpf: string | null;
  phoneStructured: null | {
    value: string;
    prefix: {
      value: string;
      countryCode: string;
    };
  };
}

export const newLimitedExtendedUser = (user: User): ExtendedUserI => ({
  ...user,
  localeSupported: searchSimilarLocale(user.locale),
  cpf: user.documents ? (user.documents["CPF"] as string | null || null) : null,
  phoneStructured: null,
});

export const newExtendedUser = (user: User): Result<ExtendedUserI, ErrorInvalidUserTelephone> => {
  const telephoneResult = UserTelephone.new(String(user.phone.national.value), `+${user.phone.code.value}`);
  if (telephoneResult.isFailure) {
    return telephoneResult;
  }

  return success({
    ...user,
    localeSupported: searchSimilarLocale(user.locale),
    cpf: user.documents ? (user.documents["CPF"] as string | null || null) : null,
    phoneStructured: telephoneResult.isFailure
      ? null
      : {
          value: telephoneResult.value.telephone,
          prefix: telephoneResult.value.prefix,
        },
  });
};
