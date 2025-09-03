import type { WebsocketTickerChannelManagerI } from "~/packages/websocket/domain/websocket-ticker-channel-manager";
import type { WebsocketTickerMessagesByType } from "~/packages/websocket/domain/websocket-messages";

/**
 * This composable can only be used inside a vue component setup function,
 * as it uses the Vue onUnmounted lifecycle hook.
 */
export function useCreateSubscriptionToWebsocketTickerChannel<T extends keyof WebsocketTickerMessagesByType>(
  channelManager: WebsocketTickerChannelManagerI,
  subscriber: {
    id: string;
    message: T;
    callback: (data: WebsocketTickerMessagesByType[T]) => void;
  },
) {
  const { $wsConnection, $dependencies } = useNuxtApp();

  if ($wsConnection) {
    onMounted(async () => {
      const result = await channelManager.subscribe($wsConnection, subscriber);
      if (result.isFailure) {
        $dependencies.common.logger.error("Error subscribing to websocket channel", result.error, { channel: "ticker", subscriberId: subscriber.id, message: subscriber.message });
        return;
      }
    });
  }

  onBeforeUnmount(async () => {
    if ($wsConnection) {
      const resultUnsubcribing = await channelManager.unsubscribe($wsConnection, subscriber.id);
      if (resultUnsubcribing.isFailure) {
        $dependencies.common.logger.error("Error unsubscribing from websocket channel", resultUnsubcribing.error, { channel: "ticker", subscriberId: subscriber.id, message: subscriber.message });
        return;
      }
    }
  });
};
