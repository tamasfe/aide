<script setup lang="ts">
const siteStore = useSiteStore();

const props = defineProps({
  class: {
    type: String,
    required: false,
    default: "",
  },
});
</script>

<template>
  <div :class="cn('relative w-full pb-[20.41%] select-none', props.class)">
    <NuxtImg
      class="w-full absolute left-0 top-0 object-cover"
      :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
      alt="Logo"
    />
  </div>
</template>
