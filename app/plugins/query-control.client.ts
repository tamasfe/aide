const OPEN_MODAL_SEARCH_PARAM = "o";

export default defineNuxtPlugin({
  name: "query-control",
  parallel: true,
  dependsOn: ["site", "user"],
  async setup(nuxtApp) {
    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();

    const userWasLoggedInBefore = useCookie<boolean>("user_was_logged_in_before", {
      default: () => false,
    });

    useRuntimeHook("frontend:event:user:logged-in", () => {
      userWasLoggedInBefore.value = true;
    });

    if (userStore.isAuthenticated) {
      userWasLoggedInBefore.value = true;
    }

    useRuntimeHook("page:finish", async () => {
      const trigger = route.query[OPEN_MODAL_SEARCH_PARAM];

      router.replace({ query: { ...route.query, [OPEN_MODAL_SEARCH_PARAM]: undefined } });

      switch (trigger) {
      // Same behaviour
        case "login":
          if (userStore.isAuthenticated) {
            return;
          }

          if (userWasLoggedInBefore.value) {
            await nuxtApp.callHook("frontend:command:modal:login:open");
            return;
          }

          await nuxtApp.callHook("frontend:command:modal:register:open");

          nuxtApp.hooks.hookOnce("frontend:event:signup-flow:submitted", () =>
            nuxtApp.callHook("frontend:command:modal:login:open"),
          );

          return;

        case "forgot":
          if (userStore.isAuthenticated) {
            router.push({ path: "/settings/account" });
          }
          await nuxtApp.callHook("frontend:command:modal:forgot-password:open");
          return;

        case "deposit":
          if (userStore.isAuthenticated) {
            await nuxtApp.callHook("frontend:command:modal:deposit:open");
            return;
          }

          if (userWasLoggedInBefore.value) {
            await nuxtApp.callHook("frontend:command:modal:login:open");

            nuxtApp.hooks.hookOnce("frontend:event:user:logged-in", () =>
              nuxtApp.callHook("frontend:command:modal:deposit:open"),
            );

            return;
          }

          await nuxtApp.callHook("frontend:command:modal:register:open");

          nuxtApp.hooks.hookOnce("frontend:event:signup-flow:submitted", () =>
            nuxtApp.callHook("frontend:command:modal:deposit:open"),
          );

          return;
      }
    });

    return {};
  },
});
