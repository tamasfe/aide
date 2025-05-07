import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export type GameDevice = components["schemas"]["Device"];

export type Game = CamelizeKeys<components["schemas"]["GameResponse"]>;

export type GameSearchResponse = CamelizeKeys<components["schemas"]["GameSearchResponse"]>;

export const toGameUrlSlug = (id: number, identifier: string): string => {
  if (!identifier) return String(id);
  return `${id}-${identifier}`;
};

export const destructureGameIdentifier = (identifier: string): { providerSlug: string; gameSlug: string } => {
  const [providerSlug, gameSlug] = identifier.split("/");
  if (!providerSlug || !gameSlug) {
    throw new Error(`Invalid game identifier: ${identifier}`);
  }
  return {
    providerSlug,
    gameSlug,
  };
};

export const constructGameIdentifier = (providerSlug: string, gameSlug: string): string => {
  if (!providerSlug || !gameSlug) {
    throw new Error(`Invalid game identifier from "${providerSlug}" & "${gameSlug}"`);
  }
  return `${providerSlug}/${gameSlug}`;
};
