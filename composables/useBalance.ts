import type { UserBalance } from "~/types/user";

export const useBalance = () => {
  const config = useRuntimeConfig();
  const headers = useRequestHeaders(["cookie"]);

  const asynDataPromise = useAsyncData(
    () =>
      $fetch<UserBalance[]>("/user/balance", {
        credentials: "include",
        headers: headers,
        baseURL: config.public.apiBaseUrl,
      }),
    {
      server: true,
      lazy: false,
    },
  );
  return asynDataPromise;
};
