import type { WebsocketConnectionI } from "~/packages/websocket/domain/websocket-connection";

/**
 * This composable can only be used inside a vue component setup function,
 * as it uses the Vue onMounted and onUnmounted lifecycle hooks.
 */
export const useCreateSubscriptionToWebsocket = (
  subscribe: (wsConnection: WebsocketConnectionI) => void,
  unsubscribe: (wsConnection: WebsocketConnectionI) => void,
) => {
  const { $wsConnection } = useNuxtApp();
  if ($wsConnection) {
    onMounted(() => subscribe($wsConnection));
    onUnmounted(() => unsubscribe($wsConnection));
  }
};
