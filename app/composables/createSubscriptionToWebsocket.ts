import type { WebsocketConnectionI } from "~/packages/websocket/domain/websocket-connection";

/**
 * This composable can only be used inside a vue component setup function,
 * as it uses the Vue onUnmounted lifecycle hook.
 */
export const useCreateSubscriptionToWebsocket = (
  wsConnection: WebsocketConnectionI,
  subscribe: (wsConnection: WebsocketConnectionI) => void,
  unsubscribe: (wsConnection: WebsocketConnectionI) => void,
) => {
  subscribe(wsConnection);
  onUnmounted(() => unsubscribe(wsConnection));
};
