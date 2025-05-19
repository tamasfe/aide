import { success } from "~/packages/result";
import type { WebsocketConnectionI } from "~/packages/websocket/domain/websocket-connection";

type WebsocketDepenencies = {
  wsConnection: null | WebsocketConnectionI;
};

export default defineNuxtPlugin({
  name: "package-websocket-init",
  dependsOn: ["module-users-initiator"],
  parallel: true,
  async setup() {
    const { $dependencies } = useNuxtApp();
    const userStore = useUserStore();

    const isServer = import.meta.server;
    if (isServer) {
      const dependencies: WebsocketDepenencies = { wsConnection: null };
      return {
        provide: dependencies,
      };
    };

    const wsConnectionResult = await $dependencies.websockets.ui.createWebsocketConnection.handle();
    if (wsConnectionResult.isFailure) {
      $dependencies.common.logger.error("Failed to create websocket connection", wsConnectionResult.error);
      const dependencies: WebsocketDepenencies = { wsConnection: null };
      return {
        provide: dependencies,
      };
    }

    /**
     * Tracker channel
     */
    const subscribeToTrackerChannelEmittingAsyncMessage = async () => {
      await $dependencies.websockets.ui.wsChannelManagers.tracker.subscribe(wsConnectionResult.value, (event) => {
        if (event.data.event === "payment_update") {
          $dependencies.common.asyncMessagePublisher.emit("girobet-backend:events:tracker:payment-updated", camelizeKeys(event.data.event_data));
        }
      });
      return success();
    };

    $dependencies.common.asyncMessagePublisher.subscribe("girobet:events:websockets:connection-state-changed", async ({ state }) => {
      if (state !== "connected") return;

      if (userStore.user) {
        await $dependencies.websockets.ui.wsChannelManagers.user.subscribe(wsConnectionResult.value);
        await subscribeToTrackerChannelEmittingAsyncMessage();
      }
    });

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-logged-in",
      async () => {
        await $dependencies.websockets.ui.wsChannelManagers.user.subscribe(wsConnectionResult.value);
        await subscribeToTrackerChannelEmittingAsyncMessage();
      },
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:signup-flows:signup-flow-submitted",
      async () => {
        await $dependencies.websockets.ui.wsChannelManagers.user.subscribe(wsConnectionResult.value);
        await subscribeToTrackerChannelEmittingAsyncMessage();
      },
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-logged-out",
      () => $dependencies.websockets.ui.wsChannelManagers.user.unsubscribe(wsConnectionResult.value),
    );
    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-closed-account",
      () => $dependencies.websockets.ui.wsChannelManagers.user.unsubscribe(wsConnectionResult.value),
    );

    const dependencies: WebsocketDepenencies = {
      wsConnection: wsConnectionResult.value,
    };

    return {
      provide: dependencies,
    };
  },
});
