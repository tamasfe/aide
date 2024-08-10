import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    const cookie = useCookie("_girobet_auth");
    if (!cookie.value) {
      return navigateTo("/?login=true");
    }
  }
  else {
    const { getUser } = useAuth();
    const user = await getUser();

    if (!user) {
      return navigateTo("/?login=true");
    }
  }
  return;
});
