import type { WebsocketConnectionI, WebsocketEventListener } from "~/packages/websocket/domain/websocket-connection";

type WebsocketDepenencies = {
  wsConnection: null | WebsocketConnectionI;
};

export default defineNuxtPlugin({
  name: "websocket",
  dependsOn: ["user"],
  parallel: true,
  async setup() {
    const userStore = useUserStore();
    const websocket = useWebsocketModule();
    const logger = useLogger();
    const nuxtApp = useNuxtApp();

    console.log("Setting up websocket plugin");

    const wsConnectionResult = await websocket.ui.createWebsocketConnection.handle();
    if (wsConnectionResult.isFailure) {
      logger.error("Failed to create websocket connection", wsConnectionResult.error);
      const dependencies: WebsocketDepenencies = { wsConnection: null };
      return {
        provide: dependencies,
      };
    }

    let balanceUpdateFp: WebsocketEventListener;
    let notificationFp: WebsocketEventListener;
    let trackerFp: WebsocketEventListener;

    watch(() => userStore.user, async (user) => {
      if (!user) {
        await websocket.ui.wsChannelManagers.user.unsubscribe(wsConnectionResult.value, balanceUpdateFp);
        await websocket.ui.wsChannelManagers.user.unsubscribe(wsConnectionResult.value, notificationFp);
        await websocket.ui.wsChannelManagers.user.unsubscribe(wsConnectionResult.value, trackerFp);

        const resultLeavingChannels = await websocket.ui.wsChannelManagers.user.leaveChannels(wsConnectionResult.value);
        if (resultLeavingChannels.isFailure) {
          logger.error("Error leaving user channels", resultLeavingChannels.error, { connection: wsConnectionResult.value });
        }
        return;
      }

      const resultEnteringUserChannels = await websocket.ui.wsChannelManagers.user.enterChannels(wsConnectionResult.value);

      if (resultEnteringUserChannels.isFailure) {
        logger.error("Error entering user channels", resultEnteringUserChannels.error, { connection: wsConnectionResult.value });
        return;
      }

      await Promise.all(
        [
          (async () => {
            const subscriptionResult = await websocket.ui.wsChannelManagers.user.subscribe(wsConnectionResult.value,
              "balance_update",
              (eventData) => {
                nuxtApp.callHook("backend:events:wallets:wallet-balance-updated", camelizeKeys(eventData.data));
              },
            );

            if (subscriptionResult.isFailure) {
              logger.error("Error subscribing to balance update message", subscriptionResult.error, { connection: wsConnectionResult.value });
              return;
            }
            else {
              balanceUpdateFp = subscriptionResult.value;
            }
          })(),
          (async () => {
            const subscriptionResult = await websocket.ui.wsChannelManagers.user.subscribe(wsConnectionResult.value,
              "notification",
              (eventData) => {
                if (eventData.data.type === "payment_status_update") {
                  console.log("Emitting payment-status-updated event");
                  nuxtApp.callHook("backend:events:payments:payment-status-updated", camelizeKeys(eventData.data));
                }

                nuxtApp.callHook("backend:events:backend-notification-received", { notification: {
                  ...camelizeKeys(eventData).data,
                  createdAt: new Date().toISOString(), // It would be better if this came from the Backend
                } });
              },
            );

            if (subscriptionResult.isFailure) {
              logger.error("Error subscribing to notification message", subscriptionResult.error, { connection: wsConnectionResult.value });
              return;
            }
            else {
              notificationFp = subscriptionResult.value;
            }
          })(),
          (async () => {
            const subscriptionResult = await websocket.ui.wsChannelManagers.user.subscribe(wsConnectionResult.value,
              "tracker",
              (event) => {
                if (event.data.event === "payment_update") {
                  nuxtApp.callHook("backend:events:tracker:payment-updated", camelizeKeys(event.data.event_data));
                }
              },
            );

            if (subscriptionResult.isFailure) {
              logger.error("Error subscribing to tracker message", subscriptionResult.error, { connection: wsConnectionResult.value });
              return;
            }
            else {
              trackerFp = subscriptionResult.value;
            }
          })(),
        ],
      );
    }, { immediate: true });

    const dependencies: WebsocketDepenencies = {
      wsConnection: wsConnectionResult.value,
    };

    return {
      provide: dependencies,
    };
  },
});
