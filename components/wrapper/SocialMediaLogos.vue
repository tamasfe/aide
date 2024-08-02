<script setup lang="ts">
import {
  PhInstagramLogo,
  PhTelegramLogo,
  PhTiktokLogo,
  PhXLogo,
} from "@phosphor-icons/vue";

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col space-y-4">
    <h3 class="text-lg text-emphasis font-semibold hidden md:block">
      {{ t("social_media") }}
    </h3>
    <div class="flex space-x-2 lg:space-x-4 justify-evenly md:justify-start">
      <div class="p-1 lg:p-3 rounded-xl hover:bg-emphasis">
        <NuxtLink
          to="/telegram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PhTelegramLogo :size="28" />
        </NuxtLink>
      </div>
      <div class="p-1 lg:p-3 rounded-xl hover:bg-emphasis">
        <NuxtLink
          to="/instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PhInstagramLogo :size="28" />
        </NuxtLink>
      </div>
      <div class="p-1 lg:p-3 rounded-xl hover:bg-emphasis">
        <NuxtLink
          to="/x"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PhXLogo :size="28" />
        </NuxtLink>
      </div>
      <div class="p-1 lg:p-3 rounded-xl hover:bg-emphasis">
        <NuxtLink
          to="/tiktok"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PhTiktokLogo :size="28" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
