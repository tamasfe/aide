export default defineNuxtRouteMiddleware((_to, _from) => {
  const walletStore = useWalletStore();
  const localePath = useLocalePath();

  if (!walletStore.wallet) {
    return navigateTo(localePath({ name: "index" }));
  }
});
