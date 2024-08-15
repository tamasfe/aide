import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async () => {
  const { getUser } = useAuth();
  const user = await getUser();
  if (!user) {
    abortNavigation();
    return navigateTo({
      path: "/",
      query: {
        login: "true",
      },
    });
  }
  return;
});
