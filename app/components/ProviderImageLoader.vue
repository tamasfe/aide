<script setup lang="ts">
const { providerId } = defineProps({
  providerId: {
    type: Number,
    required: true,
  },
});

const { $dependencies } = useNuxtApp();

const { data: imageSrc, status: loadingStatus } = await useAsyncData(String(providerId), async () => {
  return $dependencies.providers.ui.findProviderImageSrcById.handle(providerId);
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
      :alt="`Provider ${providerId} logo`"
      class="w-full h-full object-contain group-hover:opacity-80"
    />
    <BaseSpinner
      v-else
      class="text-subtle"
      :size="34"
    />
  </div>
</template>
