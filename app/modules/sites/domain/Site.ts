import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { CamelizeKeys } from "~/utils";

export type Site = CamelizeKeys<components["schemas"]["Site"]>;
