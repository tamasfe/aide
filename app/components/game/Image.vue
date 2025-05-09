<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { destructureGameIdentifier } from "~/modules/games/domain/Game";

const { t } = useI18n();
const siteStore = useSiteStore();
const props = defineProps<{
  identifier: string;
  altText?: string;
  class?: HTMLAttributes["class"];
}>();

const fallbackAltText = computed(() => {
  const { gameSlug, providerSlug } = destructureGameIdentifier(props.identifier);
  return t("game.game_image_alt", {
    game: toSentenceCase(gameSlug),
    provider: toSentenceCase(providerSlug),
  });
});

const fallbackImgSrc = ref(siteStore.getCdnGameImageUrl(props.identifier, { size: "200w" }));
const showFallbackImg = ref(false);

const onImageError = () => {
  showFallbackImg.value = true;
  fallbackImgSrc.value = siteStore.getAssetPath("images/logos/logo-sm.svg");
};
</script>

<template>
  <picture :class="cn(showFallbackImg ? 'px-8 block w-full h-full' : 'block w-full h-full object-cover', props.class)">
    <template v-if="!showFallbackImg">
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
            :media="size.screenSize ? `(max-width: ${size.screenSize})` : ''"
            :srcset="
              `${siteStore.getCdnGameImageUrl(props.identifier, { format, size: size.imageSize })}`"
          >
        </template>
      </template>
    </template>
    <NuxtImg
      class="block w-full h-full"
      :src="fallbackImgSrc"
      :placeholder="fallbackImgSrc"
      :alt="altText || fallbackAltText"
      @error="onImageError"
    />
  </picture>
</template>
