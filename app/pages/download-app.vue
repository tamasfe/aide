<script setup lang="ts">
const { $pwa } = useNuxtApp();
const { isChrome, isApple, isAndroid, isSafari, isFirefox } = useDevice();
const siteStore = useSiteStore();
const { t } = useI18n();

useHead({
  title: t("page.download_app"),
});

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

    <p>
      You are in
      <span v-if="isAndroid">an Android device</span>
      <span v-else-if="isApple">an Apple device</span>
      <span v-else>an unknown device</span>
      , using
      <span v-if="isChrome">Chrome</span>
      <span v-else-if="isSafari">Safari</span>
      <span v-else-if="isFirefox">Firefox</span>
      <span v-else>an unknown browser</span>
    </p>

    <p v-if="$pwa === undefined || siteStore.currentSite.identifier !== 'girobet'">
      {{ $t("download_app_page.download_not_available") }}
    </p>
    <div v-else>
      <div class="hidden">
        Debug tools:
        <p>swActivated: {{ $pwa.swActivated }}</p>
      </div>
      <div v-if="!$pwa.isPWAInstalled">
        <BaseButton
          variant="primary"
          class="flex items-center justify-center gap-2"
          @click="() => onClickDownloadPWA()"
        >
          <BaseIcon name="lucide:download" :size="22" />
          {{ $t("button.download_app") }}
        </BaseButton>
      </div>

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
    </div>
  </AppPage>
</template>
