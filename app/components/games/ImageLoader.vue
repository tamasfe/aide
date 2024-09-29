<script setup lang="ts">
const { gameId } = defineProps({
  gameId: {
    type: Number,
    required: true,
  },
});

const { $dependencies } = useNuxtApp();

const { data: imageSrc, status: loadingStatus } = await useAsyncData(String(gameId), async () => {
  return $dependencies.games.ui.findGameImageSrcByGameId.handle(gameId);
}, {
  server: true, // If false: avoid server-side loading of image to improve first-print time. More info @https://nuxt.com/docs/getting-started/data-fetching#client-only-fetching
  lazy: true, // If true: do not await the resolved value from the promise to print the spinner. More info @https://nuxt.com/docs/getting-started/data-fetching#lazy
});
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <NuxtImg
      v-if="imageSrc && loadingStatus === 'success'"
      :src="imageSrc"
      alt=""
      class="block w-full h-full object-cover transition-transform transform hover:scale-105 cursor-pointer"
    />
    <BaseSpinner
      v-else
      class="text-subtle"
      :size="34"
    />
  </div>
</template>
