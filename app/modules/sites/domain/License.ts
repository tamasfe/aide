import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { CamelizeKeys } from "~/utils";

export type License = CamelizeKeys<components["schemas"]["LicenseResponse"]>;
