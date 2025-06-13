import { ErrorInvalidGameIdentifier } from "./ErrorInvalidGameIdentifier";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import { fail, success, type Result } from "~/packages/result";

export type GameDevice = components["schemas"]["Device"];

export type Game = CamelizeKeys<components["schemas"]["GameResponse"]>;

export type GameSearchResponse = CamelizeKeys<components["schemas"]["GameSearchResponse"]>;

export const toGameUrlSlug = (id: number, identifier: string): string => {
  if (!identifier) return String(id);
  return `${id}-${identifier}`;
};

export const destructureGameIdentifier = (identifier: string): Result<{ providerSlug: string; gameSlug: string }, ErrorInvalidGameIdentifier> => {
  const [first, second] = identifier.split("/");
  if (!first || !second) {
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
