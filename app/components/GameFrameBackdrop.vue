<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// DESIGN STATUS:       ✅
//   * its not very clean having 2 elements in a row absolute positioned without z-indexes. the reason its like this is because the container that holds the slot CANT be absolute as we need the contents of the slot to determine the height (like on mobile).
//   * maybe it can be done with a standard background image and :after or something
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const props = defineProps<{
  authenticated: boolean;
  replace: boolean;
  class?: HTMLAttributes["class"];
  src: string | null;
}>();

const siteStore = useSiteStore();

const srcBackground = computed(() => {
  return props.src + "?variant=background";
});
</script>

<template>
  <div
    :class="cn(
      'w-full relative bg-emphasis overflow-hidden',
      props.class,
    )"
  >
    <slot
      v-if="authenticated"
      name="authenticated"
    />
    <template v-if="!replace || (replace && !authenticated)">
      <GameImage
        :src="srcBackground || siteStore.getAssetPath('images/logos/logo.svg')"
        class="absolute top-0 left-0 z-[1] w-full h-full object-cover"
      />
      <div class="absolute z-[2] top-0 left-0 w-full h-full bg-default/85 backdrop-blur-2xl" />
      <div class="h-full relative z-[3] flex items-center justify-center">
        <slot />
      </div>
    </template>
  </div>
</template>
