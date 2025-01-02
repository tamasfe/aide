import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export type WebsocketMessagesToServer = components["schemas"]["WebsocketClientEvent"];
export type WebsocketMessagesFromServer = components["schemas"]["WebsocketServerEvent"];

export type WebsocketMessagesByType = {
  winning_now: WebsocketMessagesFromServer & {
    type: "ticker";
    data: {
      type: "winning_now";
    };
  };

  payment_status_update: WebsocketMessagesFromServer & {
    type: "notification";
    data: {
      type: "payment_status_update";
    };
  };

  kyc_completed: WebsocketMessagesFromServer & {
    type: "notification";
    data: {
      type: "kyc_completed";
    };
  };

  channel_entered: WebsocketMessagesFromServer & {
    type: "protocol";
    data: {
      channel_entered: "newest_wins";
    };
  };
};
