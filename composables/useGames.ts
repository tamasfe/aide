import type { Ref } from "vue";
import type { AsyncDataOptions } from "#app";
import type { ApiData } from "~/types/api";
import type { Game, UseGamesOptions } from "~/types/game";

export const useGames = (
  options: Ref<UseGamesOptions>,
  asyncDataOptions?: AsyncDataOptions<ApiData<Game[]>>,
) => {
  const config = useRuntimeConfig();

  const asyncDataPromise = useAsyncData(
    JSON.stringify(options.value),
    () =>
      $fetch<ApiData<Game[]>>("/game/list", {
        query: {
          category: options.value.categories.join(","),
          offset: options.value.offset,
          limit: options.value.limit,
        },
        baseURL: config.public.apiBaseUrl,
      }),
    {
      server: true,
      lazy: false,
      ...asyncDataOptions,
    },
  );

  return asyncDataPromise;
};
