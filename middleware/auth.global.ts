import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async () => {
  const { getUser, isAuthenticated } = useAuth();
  if (import.meta.server) {
    const cookie = useCookie("_girobet_auth");
    if (!cookie.value) {
      isAuthenticated.value = false;
      return;
    }
  }
  else {
    const user = await getUser();
    if (!user) {
      isAuthenticated.value = false;
      return;
    }
  }
  isAuthenticated.value = true;
  return;
});
