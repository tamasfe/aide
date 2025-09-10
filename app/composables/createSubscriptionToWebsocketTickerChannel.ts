import type { WebsocketTickerChannelManagerI } from "~/packages/websocket/domain/websocket-ticker-channel-manager";
import type { WebsocketTickerMessagesByType } from "~/packages/websocket/domain/websocket-messages";
import { useWindowFocus } from "@vueuse/core";

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
  const isFocused = useWindowFocus();

  if ($wsConnection) {
    onMounted(async () => {
      // Initially subscribe, as we assume on mount the window is focused
      const result = await channelManager.subscribe($wsConnection, subscriber);
      if (result.isFailure) {
        $dependencies.common.logger.error("Error subscribing to websocket channel", result.error, { channel: "ticker", subscriberId: subscriber.id, message: subscriber.message });
        return;
      }

      watch(() => isFocused.value, async (newValue) => {
        // If window becomes focused: subscribe (knowing that if it's already subscribed this does nothing)
        if (newValue) {
          const result = await channelManager.subscribe($wsConnection, subscriber);
          if (result.isFailure) {
            $dependencies.common.logger.error("Error subscribing to websocket channel", result.error, { channel: "ticker", subscriberId: subscriber.id, message: subscriber.message });
            return;
          }
          return;
        }

        // If window becomes unfocused: wait X seconds, then check at that moment if it's focused, then unsubscribe if still unfocused
        const SECONDS_TO_WAIT_BEFORE_UNSUBSCRIBING_WHEN_UNFOCUSED = 5;
        setTimeout(async () => {
          if (!isFocused.value) {
            const result = await channelManager.unsubscribe($wsConnection, subscriber.id);
            if (result.isFailure) {
              $dependencies.common.logger.error("Error unsubscribing from websocket channel", result.error, { channel: "ticker", subscriberId: subscriber.id, message: subscriber.message });
              return;
            }
          }
        }, 1000 * SECONDS_TO_WAIT_BEFORE_UNSUBSCRIBING_WHEN_UNFOCUSED);
      });
    });
  }

  // Under no circumstance we want to keep subscribed when the component unmounts
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
