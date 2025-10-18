export default defineNuxtPlugin({
  name: "clarity",
  parallel: true,
  async setup(nuxtApp) {
    const userStore = useUserStore();
    const route = useRoute();
    const { proxy } = useScriptClarity();

    /*
     * We want to initialise it as late as possible to disrupt the user experience as little as possible.
     */

    watch(
      () => userStore.user,
      async (user) => {
        if (!user) return;
        proxy.clarity("identify", String(user.id), undefined, route.fullPath, user.username);
      },
      { immediate: true },
    );

    nuxtApp.hook("frontend:events:signup-flows:signup-flow-submitted", async () => {
      proxy.clarity("upgrade");
      proxy.clarity("event", "signup");
    });

    nuxtApp.hook("frontend:events:games:game-session-started", async () => {
      proxy.clarity("event", "game-session-started");
    });

    nuxtApp.hook("frontend:events:payments:deposit-flow-created", async () => {
      proxy.clarity("upgrade", "deposit-created");
      proxy.clarity("event", "deposit-created");
    });

    nuxtApp.hook("backend:events:payments:payment-status-updated", async (event) => {
      if (event.data.status === "succeeded") {
        proxy.clarity("upgrade", "deposit-succeeded");
        proxy.clarity("event", "deposit-succeeded");
      }
    });
  },
});
