<script setup lang="ts">
const { params } = useRoute();
const { $dependencies } = useNuxtApp();

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const providerId = Number(params.id);
if (!providerId || Number.isNaN(providerId)) {
  $dependencies.common.logger.warn("Provider ID route parameter should be a number", { providerId });
  await navigateTo("/");
}

const { data: providerFromApi, status } = await useAsyncData(`provider-${providerId}`, async () => {
  return $dependencies.providers.ui.findProviderByIdOnProviderPage.handle(providerId);
}, { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING });
if (!providerFromApi.value && (status.value === "success" || status.value === "error")) {
  await navigateTo("/");
}
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <GridVerticalGames :title="providerFromApi?.name || ''" :provider-id="providerId" :category-identifier="null" />
    </div>
  </NuxtLayout>
</template>
