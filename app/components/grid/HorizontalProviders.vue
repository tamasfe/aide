<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const { t } = useI18n();

const loading = useState(`grid-horizontal-providers-loading`, () => true);
const nextProvidersPageToSearch = useState(`grid-horizontal-providers-next-page`, () => 0);
const providerIds = useState<number[]>(`grid-horizontal-providers-ids`, () => []);
const canLoadMore = useState(`grid-horizontal-providers-can-load-more`, () => true);

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const onLoadData = async () => {
  if (!canLoadMore.value) return;
  loading.value = true;

  const { providers: foundProviders, canLoadMore: updatedCanLoadMore } = await $dependencies.providers.ui.searchProvidersOnGrid.handle(null, nextProvidersPageToSearch.value);
  providerIds.value.push(...foundProviders.map(provider => provider.id));
  canLoadMore.value = updatedCanLoadMore;
  nextProvidersPageToSearch.value += 1;

  loading.value = false;
};

await useAsyncData(`load-providers`, () => onLoadData().then(() => true), { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING });
</script>

<template>
  <GridHeaderHorizontal
    v-show="loading || providerIds.length > 0"
    :can-load-more="canLoadMore"
    :data="providerIds"
    :slides-before-load="10"
    :columns="{
      sm: 2.7,
      md: 2.7,
      lg: 2.7,
      xl: 2.7,
    }"
    :slides-to-scroll="{
      sm: 2,
      md: 2,
      lg: 2,
      xl: 2,
    }"
    :loading="loading"
    :gap="2"
    aspect-ratio="16/9"
    @trigger:load="onLoadData"
  >
    <template #title>
      <GridHeaderTitle :title="t('grid.providers')" />
    </template>

    <!-- Commenting pending to decide where to take the user when clicking the "see all providers" -->
    <!-- <template #options>
      <NuxtLink
        :to="{
          name: 'providers-id',
          params: { id: '1' },
        }"
      >
        <BaseButton
          variant="subtle"
          size="sm"
        >
          {{ t("button.see_all") }}
        </BaseButton>
      </NuxtLink>
    </template> -->

    <template #default="{ item: providerId }">
      <div class="group flex flex-col gap-2 justify-between w-full h-full">
        <div class="flex-1 rounded-[0.7rem] overflow-hidden">
          <NuxtLink
            :to="{
              name: 'providers-id',
              params: { id: providerId },
            }"
          >
            <ProviderImageLoader :provider-id="providerId" />
          </NuxtLink>
        </div>

        <!-- Commenting until the endpoint returns how many games the provider has  -->
        <!-- <div class="w-full flex justify-center font-medium bg-button-primary text-transparent bg-clip-text">
          {{ t("grid.game_count", { count: 69 }) }}
        </div> -->
      </div>
    </template>
  </GridHeaderHorizontal>
</template>
