import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export type Provider = components["schemas"]["GameProviderResponse"];

export type ProviderSearchResponse = CamelizeKeys<components["schemas"]["PaginatorResponse_for_ScoredSearchResponseItem_for_SearchGameProviderResponse_and_SearchQuery_and_Nullable_uint"]["data"][number]>;
