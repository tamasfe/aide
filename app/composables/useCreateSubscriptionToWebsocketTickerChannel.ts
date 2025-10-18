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

  let listenerWrapperReference: WebsocketEventListener;

  if ($wsConnection) {
    onMounted(async () => {
      // Initially subscribe, as we assume on mount the window is focused
      const result = await channelManager.subscribe($wsConnection, message, callback);

      if (result.isFailure) {
        logger.error("Error subscribing to websocket channel", result.error, { channel: "ticker", message });
        return;
      }
      else {
        listenerWrapperReference = result.value;
      }

      watch(() => isFocused.value, async (newValue) => {
        // If window becomes focused: subscribe (knowing that if it's already subscribed this does nothing)
        if (newValue) {
          const result = await channelManager.subscribe($wsConnection, message, callback);

          if (result.isFailure) {
            logger.error("Error subscribing to websocket channel", result.error, { channel: "ticker", message });
            return;
          }

          listenerWrapperReference = result.value;
        }

        // If window becomes unfocused: wait X seconds, then check at that moment if it's focused, then unsubscribe if still unfocused
        // const SECONDS_TO_WAIT_BEFORE_UNSUBSCRIBING_WHEN_UNFOCUSED = 5;
        else {
          const result = await channelManager.unsubscribe($wsConnection, listenerWrapperReference);

          if (result.isFailure) {
            logger.error("Error unsubscribing from websocket channel", result.error, { channel: "ticker", message });
          }
        }
      });
    });
  }

  // Under no circumstance we want to keep subscribed when the component unmounts
  onUnmounted(async () => {
    if ($wsConnection) {
      const resultUnsubcribing = await channelManager.unsubscribe($wsConnection, listenerWrapperReference);
      if (resultUnsubcribing.isFailure) {
        logger.error("Error unsubscribing from websocket channel", resultUnsubcribing.error, { channel: "ticker", message });
        return;
      }
    }
  });
};
