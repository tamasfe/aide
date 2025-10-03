import { ErrorInvalidGameIdentifier } from "./ErrorInvalidGameIdentifier";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import { fail, success, type Result } from "~/packages/result";

export type GameDevice = components["schemas"]["Device"];

export type Game = CamelizeKeys<components["schemas"]["GameResponse"]>;

export type GameSearchResponse = CamelizeKeys<components["schemas"]["PaginatorResponse_for_ScoredSearchResponseItem_for_SearchGameResponse_and_SearchQuery_and_Nullable_uint"]["data"][number]>;

export const toGameUrlSlug = (id: number, identifier: string): string => {
  if (!identifier) return String(id);
  return `${id}-${identifier}`;
};

export class GameIdentifier {
  public static newFromString(identifier: string): Result<GameIdentifier, ErrorInvalidGameIdentifier> {
    const destructuredResult = destructureGameIdentifier(identifier);
    if (destructuredResult.isFailure) {
      return destructuredResult;
    }
    const { providerSlug, gameSlug } = destructuredResult.value;
    return success(new GameIdentifier(gameSlug, providerSlug));
  }

  public static newFromSlugs(providerSlug: string, gameSlug: string): GameIdentifier {
    return new GameIdentifier(gameSlug, providerSlug);
  }

  public readonly value: string;

  public toJSON() {
    return {
      value: this.value,
      gameSlug: this.gameSlug,
      providerSlug: this.providerSlug,
    };
  }

  private constructor(public readonly gameSlug: string, public readonly providerSlug: string) {
    if (!providerSlug || !gameSlug) {
      throw new Error(`Invalid game identifier from "${providerSlug}" & "${gameSlug}"`);
    }
    this.value = `${providerSlug}/${gameSlug}`;
  }
}

export const destructureGameIdentifier = (identifier: string): Result<{ providerSlug: string; gameSlug: string }, ErrorInvalidGameIdentifier> => {
  const [first, second, third] = identifier.split("/");
  if (!first || !second) {
    return fail(new ErrorInvalidGameIdentifier(identifier));
  }
  if (third) {
    return fail(new ErrorInvalidGameIdentifier(identifier));
  }
  return success({
    providerSlug: first,
    gameSlug: second,
  });
};

export const constructGameIdentifier = (providerSlug: string, gameSlug: string): string => {
  if (!providerSlug || !gameSlug) {
    throw new Error(`Invalid game identifier from "${providerSlug}" & "${gameSlug}"`);
  }
  return `${providerSlug}/${gameSlug}`;
};
