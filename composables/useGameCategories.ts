import type { Category } from "~/types/api";

export const useGameCategories = async (group?: string) => {
  const config = useRuntimeConfig();

  // temp until categories auth is removed,
  // not sure if it will be
  // TODO: rm headers
  const headers = useRequestHeaders(["cookie"]);

  const asyncDataPromise = useAsyncData(
    `useGameCategories-${group}`,
    () =>
      $fetch<Category[]>("/game/category/list", {
        credentials: "include",
        headers: headers,
        query: {
          group: group,
        },
        baseURL: config.public.apiBaseUrl,
      }),
    {
      server: true,
      lazy: false,
    },
  );

  return asyncDataPromise;
};
