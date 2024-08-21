<script setup lang="ts">
import {
  PhInstagramLogo,
  PhTelegramLogo,
  PhTiktokLogo,
  PhXLogo,
} from "@phosphor-icons/vue";
import type { Language } from "@/types/constants";

const { t } = useI18n();

const props = defineProps<{
  code: Language;
}>();

const telegramUrl = computed(() => {
  return "TODO";
});

const instagramUrl = computed(() => {
  if (props.code === "pt") {
    return "https://www.instagram.com/girobetofficial/";
  }
  // eventually default to english
  return "https://www.instagram.com/girobetofficial/";
});

const xUrl = computed(() => {
  if (props.code === "pt") {
    return "https://x.com/girobet";
  }
  // eventually default to english
  return "https://x.com/girobet";
});

const tiktokUrl = computed(() => {
  if (props.code === "pt") {
    return "https://www.tiktok.com/@girobetofficial";
  }
  // eventually default to english
  return "https://www.tiktok.com/@girobetofficial";
});
</script>

<template>
  <div class="flex flex-col">
    <h3 class="text-lg text-emphasis font-semibold hidden md:block">
      {{ t("footer.social_media") }}
    </h3>
    <div class="mt-8 md:mt-0 flex space-x-2 lg:space-x-4 justify-evenly md:justify-start">
      <NuxtLink
        :to="telegramUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="p-1 lg:p-3 rounded-xl hover:bg-emphasis"
      >
        <PhTelegramLogo :size="28" />
      </NuxtLink>
      <NuxtLink
        :to="instagramUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="p-1 lg:p-3 rounded-xl hover:bg-emphasis"
      >
        <PhInstagramLogo :size="28" />
      </NuxtLink>
      <NuxtLink
        :to="xUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="p-1 lg:p-3 rounded-xl hover:bg-emphasis"
      >
        <PhXLogo :size="28" />
      </NuxtLink>
      <NuxtLink
        :to="tiktokUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="p-1 lg:p-3 rounded-xl hover:bg-emphasis"
      >
        <PhTiktokLogo :size="28" />
      </NuxtLink>
    </div>
  </div>
</template>
