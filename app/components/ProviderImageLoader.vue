<script setup lang="ts">
const { providerIdentifier } = defineProps({
  providerIdentifier: {
    type: String,
    required: true,
  },
});

const siteStore = useSiteStore();

const imageSrc = computed(() => `${siteStore.getCdnProviderImageUrl(providerIdentifier)}`);
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <NuxtImg
      :src="imageSrc"
      :alt="`Provider ${providerIdentifier} logo`"
      class="w-full h-full object-contain group-hover:opacity-80"
    />
  </div>
</template>
