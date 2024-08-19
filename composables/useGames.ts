import type { Reactive } from "vue";
import type { ApiData } from "~/types/api";
import type { Game, UseGamesOptions } from "~/types/game";

export const useGames = (options: Reactive<UseGamesOptions>) => {
  const config = useRuntimeConfig();

  const asyncDataPromise = useAsyncData(
    JSON.stringify(options),
    () =>
      $fetch<ApiData<Game[]>>("/game/list", {
        query: {
          category: options.categories.join(","),
          offset: options.offset,
          limit: options.limit,
        },
        baseURL: config.public.apiBaseUrl,
      }),
    {
      server: true,
      lazy: false,
      watch: [options],
    },
  );

  return asyncDataPromise;
};
