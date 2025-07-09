<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { destructureGameIdentifier } from "~/modules/games/domain/Game";

const siteStore = useSiteStore();

const props = defineProps<{
  identifier: string;
  // altText?: string;
  class?: HTMLAttributes["class"];
  fallbackImageClass?: HTMLAttributes["class"];
}>();

const gameSlug = computed(() => {
  const result = destructureGameIdentifier(props.identifier);
  if (result.isFailure) {
    return undefined;
  }
  return toSentenceCase(result.value.gameSlug);
});
</script>

<template>
  <NuxtPicture
    provider="custom_cloudflare"
    sizes="xs:220px sm:200px md:160px lg:145px"
    format="webp"
    :class="cn('w-full h-full aspect-[3/4]', props.class)"
    :placeholder="siteStore.getRelativeAssetPath('logos/logo-sm.svg')"
    :src="`/games/${props.identifier}.jpg`"
    :style="{
      backgroundImage: `url(${siteStore.getRelativeAssetPath('logos/logo-sm.svg')})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '35%',
    }"
    :alt="gameSlug"
  />
</template>

<style scoped>
.hide-text {
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
}
</style>

<style>
img[data-error="1"] {
  display: none;
}
</style>
