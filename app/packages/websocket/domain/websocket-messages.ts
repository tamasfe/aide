import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export type WebsocketMessagesToServer = components["schemas"]["WebsocketClientEvent"];
export type WebsocketMessagesFromServer = components["schemas"]["WebsocketServerEvent"];

/**
 * Messages sent through a user-related channel. Only for logged in users.
 */
export type WebsocketUserMessagesByType = {
  notification: Extract<WebsocketMessagesFromServer, { type: "notification" }>;
  balance_update: Extract<WebsocketMessagesFromServer, { type: "balance_update" }>;
  tracker: Extract<WebsocketMessagesFromServer, { type: "tracker" }>;
};

/**
 * Sent through an open channel
 */
export type WebsocketTickerMessagesByType = {
  winning_now: Extract<WebsocketMessagesFromServer, { type: "ticker" }>;
};

export type WebsocketMessagesByType = WebsocketUserMessagesByType & WebsocketTickerMessagesByType;
