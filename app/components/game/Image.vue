<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { destructureGameIdentifier } from "~/modules/games/domain/Game";

const siteStore = useSiteStore();

const props = defineProps<{
  identifier: string;
  class?: HTMLAttributes["class"];
  fallbackImageClass?: HTMLAttributes["class"];
}>();

const gameTitle = computed(() => {
  const result = destructureGameIdentifier(props.identifier);
  if (result.isFailure) {
    return undefined;
  }
  return toSentenceCase(result.value.gameSlug);
});
</script>

<template>
  <NuxtImg
    provider="custom_cloudflare"
    sizes="xs:132px sm:156px md:114px lg:156px"
    format="webp"
    quality="30"
    :class="cn('w-full h-full aspect-[3/4] text-primary text-center', props.class)"
    :src="`/games/${props.identifier}.jpg`"
    :style="{
      backgroundImage: `url(${siteStore.getRelativeAssetPath('logos/logo-sm.svg')})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 50%',
      backgroundSize: '35%',
    }"
    :alt="gameTitle"
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

</style>
