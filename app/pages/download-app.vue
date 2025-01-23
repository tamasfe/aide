<script setup lang="ts">
const { $pwa } = useNuxtApp();

const onClickDownloadPWA = async () => {
  if (!$pwa) {
    return;
  }

  const result = await $pwa.install();
  if (result) {
    console.log("PWA install process finished", { result });
  }
};

const onClickRefreshPWA = async () => {
  if (!$pwa) {
    return;
  }

  await $pwa.updateServiceWorker(true);
};
</script>

<template>
  <AppPage :title="$t('download_app_page.title')">
    <p class="text-xl">
      {{ $t("download_app_page.description") }}
    </p>
    <p v-if="$pwa === undefined">
      {{ $t("download_app_page.download_not_available") }}
    </p>
    <div v-else>
      <div v-if="$pwa.isPWAInstalled">
        <div v-if="$pwa.needRefresh">
          <BaseButton
            variant="primary"
            class="flex items-center justify-center gap-2"
            @click="() => onClickRefreshPWA()"
          >
            <BaseIcon name="lucide:download" :size="22" />
            {{ $t("button.update_app") }}
          </BaseButton>
        </div>

        <p v-else>
          {{ $t("download_app_page.download_already_downloaded") }}
        </p>
      </div>

      <BaseButton
        v-else
        variant="primary"
        class="flex items-center justify-center gap-2"
        @click="() => onClickDownloadPWA()"
      >
        <BaseIcon name="lucide:download" :size="22" />
        {{ $t("button.download_app") }}
      </BaseButton>
    </div>
  </AppPage>
</template>
