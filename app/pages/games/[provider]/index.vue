<script setup lang="ts">
const { params } = useRoute();
const providers = useGameProviderModule();
const { t } = useI18n();
const logger = useLogger();

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;

const providerIdentifier = String(params.provider);
if (!providerIdentifier || Number.isNaN(providerIdentifier)) {
  logger.warn("Provider slug route parameter should be a number", { providerIdentifier });
  await navigateTo("/");
}

definePageMeta({
  layout: "carousel",
});

useHead({
  title: t("page.provider", { provider: params.id }),
});

const { data: providerFromApi, status } = useAsyncData(`provider-${providerIdentifier}`, async () => {
  return providers.ui.findProviderByIdentifierOnProviderPage.handle(providerIdentifier);
}, { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING });
if (!providerFromApi.value && (status.value === "success" || status.value === "error")) {
  await navigateTo("/");
}

watch(() => providerFromApi.value, (provider) => {
  if (provider) {
    useHead({
      title: t("page.provider", { provider: provider.name }),
    });
  }
});
</script>

<template>
  <GridVerticalGames
    :title="providerFromApi?.name || ''"
    :provider-identifier="providerIdentifier"
    :category-identifier="null"
    :show-back-button="true"
  />
</template>
