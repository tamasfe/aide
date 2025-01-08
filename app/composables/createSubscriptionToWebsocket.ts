import type { WebsocketChannelI } from "../packages/websocket/infra/ui/websocket-channel-interface";

/**
 * This composable can only be used inside a vue component setup function,
 * as it uses the Vue onUnmounted lifecycle hook.
 */
export function useCreateSubscriptionToWebsocket<T>(
  channel: WebsocketChannelI<T>,
  callback: (data: T) => void,
) {
  const { $wsConnection } = useNuxtApp();

  if ($wsConnection) {
    onMounted(() =>
      channel.subscribe($wsConnection, callback));

    onUnmounted(() => channel.unsubscribe($wsConnection));
  }
};
