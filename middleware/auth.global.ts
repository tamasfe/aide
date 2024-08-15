import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async () => {
  const { getUser, isAuthenticated } = useAuth();
  const user = await getUser();
  if (!user) {
    isAuthenticated.value = false;
    return;
  }
  isAuthenticated.value = true;
  return;
});
