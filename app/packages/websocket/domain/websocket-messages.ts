import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export type WebsocketMessagesToServer = components["schemas"]["WebsocketClientEvent"];
export type WebsocketMessagesFromServer = components["schemas"]["WebsocketServerEvent"];

export type WebsocketMessagesByType = {
  winning_now: {
    type: "ticker";
    data: Extract<components["schemas"]["TickerType"], { type: "winning_now" }>;
  };
  payment_status_update: {
    type: "notification";
    data: Extract<components["schemas"]["WebsocketServerEvent"]["data"], { type: "payment_status_update" }>;
  };
  balance_update: Extract<components["schemas"]["WebsocketServerEvent"], { type: "balance_update" }>;
  channel_entered: Extract<components["schemas"]["WebsocketServerEvent"], { type: "ticker"; data: { type: "winning_now" } }>;
  tracker: Extract<components["schemas"]["WebsocketServerEvent"], { type: "tracker" }>;
};
