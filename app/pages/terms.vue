<script setup lang="ts">
const NUMBER_OF_TERM_SECTIONS = 25;

const url = useRequestURL();
const { t } = useI18n();

useHead({
  title: t("terms_and_conditions.title"),
});
</script>

<template>
  <AppPage
    :title="$t('terms_and_conditions.title')"
    version="2.0"
    date="September 1, 2024"
  >
    <div v-for="index in NUMBER_OF_TERM_SECTIONS" :key="index">
      <h4>{{ $t(`terms_and_conditions.subtitle_${index}`) }}</h4>
      <p class="whitespace-pre-wrap">{{ $t(`terms_and_conditions.content_${index}`, { host: url.host }) }}</p>
    </div>
  </AppPage>
</template>
