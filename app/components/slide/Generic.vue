<script setup lang="ts">
import type { SlideData } from "~/types/slides";
import BaseLink from "~/components/base/Link.vue";

interface Props {
  slide: SlideData;
}

const props = defineProps<Props>();
const siteStore = useSiteStore();

defineOptions({ inheritAttrs: false });

const component = computed(() => {
  switch (props.slide.action.type) {
    case "link":
      return BaseLink;
    case "callback":
      return "button";
    default:
      return "div";
  }
});
</script>

<template>
  <component
    :is="component"
    class="block w-full h-full"
    v-bind="slide.action.attributes"
  >
    <NuxtImg
      v-bind="$attrs"
      provider="custom_cloudflare"
      sizes="420px sm:310px md:240px lg:406px"
      format="webp"
      quality="40"
      :fetchpriority="slide.fetchpriority || 'auto'"
      :src="siteStore.getRelativeAssetPath(slide.imagePath)"
      :alt="slide.alt || ''"
      class="block rounded md:rounded-lg object-cover object-center w-full h-full aspect-[1280/607]"
    />
  </component>
</template>
