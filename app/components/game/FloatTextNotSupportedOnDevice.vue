<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  currentDevice: "mobile" | "desktop";
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full w-full">
    <div class="text-center">
      <h1 class="text-2xl font-semibold text-subtle">{{ t("game_page.device_not_supported") }}</h1>
      <p class="mt-6 text-subtle">
        {{ currentDevice === 'desktop' ? t("game_page.device_not_supported_alternative_mobile") : t("game_page.device_not_supported_alternative_desktop") }}
      </p>
    </div>
  </div>
</template>
