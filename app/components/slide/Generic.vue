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
    v-bind="slide.action.attributes"
  >
    <NuxtImg
      v-bind="$attrs"
      provider="custom_cloudflare"
      sizes="380px md:403px"
      format="webp"
      quality="40"
      :fetchpriority="slide.fetchpriority || 'auto'"
      :src="siteStore.getRelativeAssetPath(slide.imagePath)"
      :alt="slide.alt || ''"
      class="block rounded md:rounded-lg object-cover object-center w-full h-full border border-emphasis/50"
    />
  </component>
</template>
