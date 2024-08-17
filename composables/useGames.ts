import type { Game, ApiData } from "~/types/api";

export const useGames = (categories: number[]) => {
  const config = useRuntimeConfig();

  const asynDataPromise = useAsyncData(
    () =>
      $fetch<ApiData<Game[]>>("/game/list", {
        query: {
          category: categories.join(","),
        },
        baseURL: config.public.apiBaseUrl,
      }),
    {
      server: true,
      lazy: false,
    },
  );
  return asynDataPromise;
};
