export default defineNuxtRouteMiddleware((_to, _from) => {
  const userStore = useUserStore();
  const localePath = useLocalePath();

  if (!userStore.isAuthenticated) {
    return navigateTo(localePath({ name: "index" }));
  }
});
