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

    const wsConnectionResult = await $dependencies.websockets.ui.createWebsocketConnection.handle();
    if (wsConnectionResult.isFailure) {
      $dependencies.common.logger.error("Failed to create websocket connection", wsConnectionResult.error);
      const dependencies: WebsocketDepenencies = { wsConnection: null };
      return {
        provide: dependencies,
      };
    }

    // $dependencies.common.asyncMessagePublisher.subscribe("frontend:events:websockets:connection-state-changed", async ({ state }) => {
    //   if (state !== "connected") return;

    //   if (userStore.user) {
    //     await $dependencies.websockets.ui.wsChannelManagers.user.subscribe(wsConnectionResult.value);
    //     await subscribeToUserChannelsEmittingAsyncMessage();
    //   }
    // });

    watch(() => userStore.user, async (user) => {
      if (!user) {
        await $dependencies.websockets.ui.wsChannelManagers.user.unsubscribe(wsConnectionResult.value, "balance_update_ws_to_async_message_subscriber");
        await $dependencies.websockets.ui.wsChannelManagers.user.unsubscribe(wsConnectionResult.value, "notification_ws_to_async_message_subscriber");
        await $dependencies.websockets.ui.wsChannelManagers.user.unsubscribe(wsConnectionResult.value, "tracker_ws_to_async_message_subscriber");

        const resultLeavingChannels = await $dependencies.websockets.ui.wsChannelManagers.user.leaveChannels(wsConnectionResult.value);
        if (resultLeavingChannels.isFailure) {
          $dependencies.common.logger.error("Error leaving user channels", resultLeavingChannels.error, { connection: wsConnectionResult.value });
        }
        return;
      }

      const resultEnteringUserChannels = await $dependencies.websockets.ui.wsChannelManagers.user.enterChannels(wsConnectionResult.value);
      if (resultEnteringUserChannels.isFailure) {
        $dependencies.common.logger.error("Error entering user channels", resultEnteringUserChannels.error, { connection: wsConnectionResult.value });
        return;
      }

      const [resultSubscribingToBalanceUpdateMessage, resultSubscribingToNotificationMessage, resultSubscribingToTrackerMessage] = await Promise.all(
        [
          $dependencies.websockets.ui.wsChannelManagers.user.subscribe(wsConnectionResult.value,
            {
              id: "balance_update_ws_to_async_message_subscriber",
              message: "balance_update",
              callback: (eventData) => {
                $dependencies.common.asyncMessagePublisher.emit("girobet-backend:events:wallets:wallet-balance-updated", camelizeKeys(eventData.data));
              },
            }),
          $dependencies.websockets.ui.wsChannelManagers.user.subscribe(wsConnectionResult.value,
            {
              id: "notification_ws_to_async_message_subscriber",
              message: "notification",
              callback: (eventData) => {
                if (eventData.data.type === "payment_status_update") {
                  $dependencies.common.asyncMessagePublisher.emit("girobet-backend:events:payments:payment-status-updated", camelizeKeys(eventData.data));
                }

                $dependencies.common.asyncMessagePublisher.emit("girobet-backend:events:backend-notification-received", { notification: {
                  ...camelizeKeys(eventData).data,
                  createdAt: new Date().toISOString(), // It would be better if this came from the Backend
                } });
              },
            }),
          $dependencies.websockets.ui.wsChannelManagers.user.subscribe(wsConnectionResult.value, {
            id: "tracker_ws_to_async_message_subscriber",
            message: "tracker",
            callback: (event) => {
              if (event.data.event === "payment_update") {
                $dependencies.common.asyncMessagePublisher.emit("girobet-backend:events:tracker:payment-updated", camelizeKeys(event.data.event_data));
              }
            },
          }),
        ],
      );

      if (resultSubscribingToBalanceUpdateMessage.isFailure) {
        $dependencies.common.logger.error("Error subscribing to balance update message", resultSubscribingToBalanceUpdateMessage.error, { connection: wsConnectionResult.value });
      }

      if (resultSubscribingToNotificationMessage.isFailure) {
        $dependencies.common.logger.error("Error subscribing to notification message", resultSubscribingToNotificationMessage.error, { connection: wsConnectionResult.value });
      }

      if (resultSubscribingToTrackerMessage.isFailure) {
        $dependencies.common.logger.error("Error subscribing to tracker message", resultSubscribingToTrackerMessage.error, { connection: wsConnectionResult.value });
      }
    }, { immediate: true });

    const dependencies: WebsocketDepenencies = {
      wsConnection: wsConnectionResult.value,
    };

    return {
      provide: dependencies,
    };
  },
});
