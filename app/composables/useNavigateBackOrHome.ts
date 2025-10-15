const DEFAULT_ROUTE = "/";

export default function (): { navigateBackOrHome: () => Promise<void> } {
  const router = useRouter();

  const localePath = useLocalePath();

  return {
    navigateBackOrHome: async () => {
      const backUrl = router.options.history.state.back;
      const previousRoute = backUrl?.toString();

      if (!previousRoute) {
        await navigateTo(localePath(DEFAULT_ROUTE));
        return;
      }

      if (!previousRoute.startsWith("/")) {
        await navigateTo(localePath(DEFAULT_ROUTE));
        return;
      }

      router.back();
      return;
    },
  };
};
