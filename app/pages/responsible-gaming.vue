<script setup lang="ts">
const { t } = useI18n();
const url = useRequestURL();

useHead({
  title: t("page.responsible_gaming"),
});
</script>

<template>
  <AppPage
    :title="$t('responsible_gaming.title')"
    version="2.0"
    date="September 1, 2024"
    :show-print-button="true"
  >
    <p class="whitespace-pre-wrap">{{ $t('responsible_gaming.content_1', { host: url.host }) }}</p>

    <h4>{{ $t('responsible_gaming.subtitle_2') }}</h4>
    <p class="whitespace-pre-wrap">{{ $t('responsible_gaming.content_2', { host: url.host }) }}</p>

    <h4>{{ $t('responsible_gaming.subtitle_3') }}</h4>
    <p class="whitespace-pre-wrap">{{ $t('responsible_gaming.content_3', { host: url.host }) }}</p>

    <h4>{{ $t('responsible_gaming.subtitle_4') }}</h4>
    <p class="whitespace-pre-wrap">{{ $t('responsible_gaming.content_4', { host: url.host }) }}</p>
  </AppPage>
</template>
