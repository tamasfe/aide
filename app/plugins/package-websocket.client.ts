export default defineNuxtPlugin({
  name: "package-websocket",
  dependsOn: ["dependency-injection"],
  parallel: true,
  async setup() {
    const { $dependencies } = useNuxtApp();

    await $dependencies.common.websocket.attemptOpeningWebsocket.handle("user");

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:websockets:connection-errored",
      async ({ channel }) => {
        // A delay is set to avoid spamming reconnections
        const THROTTLE_PERIOD_MS = 1500;
        setTimeout(() => $dependencies.common.websocket.attemptOpeningWebsocket.handle(channel), THROTTLE_PERIOD_MS);
      },
    );

    $dependencies.common.asyncMessagePublisher.subscribe(
      "girobet:events:users:user-logged-in",
      () => $dependencies.common.websocket.attemptOpeningWebsocket.handle("user"),
    );

    return {};
  },
});
