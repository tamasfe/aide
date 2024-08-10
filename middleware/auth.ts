import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    const cookie = useCookie("_girobet_auth");
    console.log("server cookie: ", cookie.value);
    if (!cookie.value) {
      return navigateTo("/?login=true");
    }
  }
  else {
    console.log("client");
    const { getUser } = useAuth();
    const user = await getUser();

    console.log("user", user);

    if (!user) {
      return navigateTo("/?login=true");
    }
  }
  return;
});
