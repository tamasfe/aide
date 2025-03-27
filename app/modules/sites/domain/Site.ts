import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { CamelizeKeysWithArrays } from "~/utils";

export type Site = CamelizeKeysWithArrays<components["schemas"]["Site"]>;
