import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export type NotificationBackend = CamelizeKeys<components["schemas"]["NotificationResponse"]>;
