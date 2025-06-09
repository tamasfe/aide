import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export type Win = CamelizeKeys<Extract<components["schemas"]["WebsocketServerEvent"], { type: "ticker" }>>;
export type WinData = Win["data"]["data"];
