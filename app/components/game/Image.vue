<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { destructureGameIdentifier } from "~/modules/games/domain/Game";

const { t } = useI18n();
const siteStore = useSiteStore();
const props = defineProps<{
  identifier: string;
  altText?: string;
  class?: HTMLAttributes["class"];
  fallbackImageClass?: HTMLAttributes["class"];
}>();

const fallbackAltText = computed(() => {
  const { gameSlug, providerSlug } = destructureGameIdentifier(props.identifier);
  return t("game.game_image_alt", {
    game: toSentenceCase(gameSlug),
    provider: toSentenceCase(providerSlug),
  });
});

const fallbackImgSrc = ref(siteStore.getCdnGameImageUrl(props.identifier, { size: "100w", quality: "50" }));
const imageExists = ref<boolean | null>(null);
const onImageError = () => {
  imageExists.value = false;
  fallbackImgSrc.value = siteStore.getAssetPath("images/logos/logo-sm.svg");
};
const onImageLoad = () => {
  imageExists.value = true;
};
</script>

<template>
  <picture :class="cn('block w-full h-full object-cover hide-text', props.class)">
    <template v-if="imageExists">
      <template
        v-for="size in [
          { imageSize: '200w' as const, screenSize: '400px' },
          { imageSize: '300w' as const, screenSize: '900px' },
          { imageSize: '600w' as const, screenSize: null },
        ]"
        :key="size.imageSize"
      >
        <template v-for="format in ['webp' as const, 'jpeg' as const]" :key="format">
          <source
            :type="`image/${format}`"
            :alt="altText || fallbackAltText"
            :placeholder="fallbackImgSrc"
            :media="size.screenSize ? `(max-width: ${size.screenSize})` : ''"
            :srcset="
              `${siteStore.getCdnGameImageUrl(props.identifier, { format, size: size.imageSize })}`"
            @error="onImageError"
          >
        </template>
      </template>
    </template>
    <NuxtImg
      :class="cn('block w-full h-full', imageExists ? '' : props.fallbackImageClass)"
      :src="fallbackImgSrc"
      :placeholder="siteStore.getAssetPath('images/logos/logo-sm.svg')"
      :alt="altText || fallbackAltText"
      @error="onImageError"
      @load="onImageLoad"
    />
  </picture>
</template>

<style scoped>
.hide-text {
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
}
</style>
