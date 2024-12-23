import { WebsocketEvent } from "websocket-ts";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { WebsocketMessagesI } from "~/packages/websocket/domain/websocket-messages";

export default defineNuxtPlugin({
  name: "package-websocket",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup() {
    const { $dependencies } = useNuxtApp();

    const reconnectAndSubscribe = async (channel: "user" | "newest_wins") => {
      const websocket = await $dependencies.websockets.ui.attemptOpeningWebsocket.handle(channel);
      if (websocket === null) {
        return;
      }

      switch (channel) {
        case "user":
          websocket.addEventListener(WebsocketEvent.message, (_i, event: MessageEvent<string>) => {
            try {
              const data = JSON.parse(event.data) as WebsocketMessagesI[keyof WebsocketMessagesI];
              switch (data.payload.type) {
                case "payment_status_update":
                  $dependencies.common.asyncMessagePublisher.emit("girobet-backend:events:payments:payment-status-updated", {
                    flowId: data.payload.data.flow_id,
                    status: data.payload.data.status,
                  });
                  break;
              }
            }
            catch (error) {
              $dependencies.common.logger.error("Failed to handle websocket message", InfrastructureError.newFromUnknownError({ wsEvent: event }, error));
            }
          });
          break;
      }
    };

    await reconnectAndSubscribe("user");

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:websockets:connection-errored",
      async ({ channel }) => {
        // A delay is set to avoid spamming reconnections
        const THROTTLE_PERIOD_MS = 1500;
        setTimeout(() => reconnectAndSubscribe(channel), THROTTLE_PERIOD_MS);
      },
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-logged-in",
      () => reconnectAndSubscribe("user"),
    );

    return {};
  },
});
