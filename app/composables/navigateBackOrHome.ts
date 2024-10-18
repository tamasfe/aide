const DEFAULT_ROUTE = "/";

export const useNavigateBackOrHome = (): { navigateBackOrHome: () => Promise<void> } => {
  const router = useRouter();

  return {
    navigateBackOrHome: async () => {
      const backUrl = router.options.history.state.back;
      const previousRoute = backUrl?.toString();

      if (!previousRoute) {
        await navigateTo(DEFAULT_ROUTE);
        return;
      }

      if (!previousRoute.startsWith("/")) {
        await navigateTo(DEFAULT_ROUTE);
        return;
      }

      router.back();
      return;
    },
  };
};
