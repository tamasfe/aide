<script setup lang="ts">
const { params } = useRoute();
const { $dependencies } = useNuxtApp();
const { t } = useI18n();

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;

const providerIdentifier = String(params.provider);
if (!providerIdentifier || Number.isNaN(providerIdentifier)) {
  $dependencies.common.logger.warn("Provider slug route parameter should be a number", { providerIdentifier });
  await navigateTo("/");
}

useHead({
  title: t("page.provider", { provider: params.id }),
});

const { data: providerFromApi, status } = await useAsyncData(`provider-${providerIdentifier}`, async () => {
  return $dependencies.providers.ui.findProviderByIdentifierOnProviderPage.handle(providerIdentifier);
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
  <NuxtLayout name="carousel">
    <div class="max-w-screen-xl mx-auto w-full px-4 giro__sections">
      <GridVerticalGames
        :title="providerFromApi?.name || ''"
        :provider-identifier="providerIdentifier"
        :category-identifier="null"
        :show-back-button="true"
      />
    </div>
  </NuxtLayout>
</template>
