import type { WebsocketTickerChannelManagerI } from "~/packages/websocket/domain/websocket-ticker-channel-manager";
import type { WebsocketTickerMessagesByType } from "~/packages/websocket/domain/websocket-messages";
import { useWindowFocus } from "@vueuse/core";
import type { WebsocketEventListener } from "../packages/websocket/domain/websocket-connection";

/**
 * This composable can only be used inside a vue component setup function,
 * as it uses the Vue onUnmounted lifecycle hook.
 */
export default function<T extends keyof WebsocketTickerMessagesByType>(
  channelManager: WebsocketTickerChannelManagerI,
  message: T,
  callback: (data: WebsocketTickerMessagesByType[T]) => void,
) {
  const { $wsConnection } = useNuxtApp();
  const logger = useLogger();

  const isFocused = useWindowFocus();

  let listenerWrapperReference: WebsocketEventListener | null = null;
  let isSubscribed = false;

  const subscribe = async (): Promise<void> => {
    if (!$wsConnection || isSubscribed) {
      return;
    }

    const result = await channelManager.subscribe($wsConnection, message, callback);

    if (result.isFailure) {
      logger.error("Error subscribing to websocket channel", result.error, { channel: "ticker", message });
      return;
    }

    listenerWrapperReference = result.value;
    isSubscribed = true;
  };

  const unsubscribe = async (): Promise<void> => {
    if (!$wsConnection || !isSubscribed || !listenerWrapperReference) {
      return;
    }

    const result = await channelManager.unsubscribe($wsConnection, listenerWrapperReference);

    if (result.isFailure) {
      logger.error("Error unsubscribing from websocket channel", result.error, { channel: "ticker", message });
      return;
    }

    listenerWrapperReference = null;
    isSubscribed = false;
  };

  if ($wsConnection) {
    onMounted(async () => {
      // Initially subscribe, as we assume on mount the window is focused
      await subscribe();

      watch(() => isFocused.value, async (newValue) => {
        if (newValue) {
          // If window becomes focused: subscribe only if not already subscribed
          await subscribe();
        }
        else {
          // If window becomes unfocused: unsubscribe immediately
          await unsubscribe();
        }
      });
    });
  }

  // Under no circumstance we want to keep subscribed when the component unmounts
  onUnmounted(async () => {
    await unsubscribe();
  });
};
