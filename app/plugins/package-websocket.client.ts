import { WebsocketEvent } from "websocket-ts";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { WebsocketMessagesI } from "~/packages/websocket/domain/websocket-messages";

export default defineNuxtPlugin({
  name: "package-websocket",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup() {
    const { $dependencies } = useNuxtApp();

    await reconnectAndSubscribe("user", $dependencies.common);

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:websockets:connection-errored",
      async ({ channel }) => {
        // A delay is set to avoid spamming reconnections
        const THROTTLE_PERIOD_MS = 1500;
        setTimeout(() => reconnectAndSubscribe(channel, $dependencies.common), THROTTLE_PERIOD_MS);
      },
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-logged-in",
      () => reconnectAndSubscribe("user", $dependencies.common),
    );

    return {};
  },
});

const reconnectAndSubscribe = async (channel: "user" | "newest_wins", commonDependencies: CommonDependenciesI) => {
  const websocket = await commonDependencies.websocket.attemptOpeningWebsocket.handle(channel);
  if (websocket === null) {
    return;
  }

  switch (channel) {
    case "user":
      websocket.addEventListener(WebsocketEvent.message, (_i, event: MessageEvent<WebsocketMessagesI[keyof WebsocketMessagesI]>) => {
        try {
          switch (event.data.payload.type) {
            case "payment_status_update":
              commonDependencies.asyncMessagePublisher.emit("girobet-backend:events:payments:payment-status-updated", {
                flowId: event.data.payload.data.flow_id,
                status: event.data.payload.data.status,
              });
              break;
          }
        }
        catch (error) {
          commonDependencies.logger.error("Failed to handle websocket message", InfrastructureError.newFromUnknownError({ wsEvent: event }, error));
        }
      });
      break;
  }
};
