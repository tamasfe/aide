<script setup lang="ts">
import type { Provider } from "~/modules/providers/domain/Provider";
import type { Keyified } from "~/types/utils";

const { $dependencies } = useNuxtApp();
const { t } = useI18n();

const loading = useState(`grid-horizontal-providers-loading`, () => true);
const nextProvidersPageToSearch = useState(`grid-horizontal-providers-next-page`, () => 0);
const providers = useState<Keyified<Provider>[]>(`grid-whorizontal-providers-ids`, () => []);
const canLoadMore = useState(`grid-horizontal-providers-can-load-more`, () => true);

const onLoadData = async () => {
  if (!canLoadMore.value) return;
  loading.value = true;

  const { providers: foundProviders, canLoadMore: updatedCanLoadMore } = await $dependencies.providers.ui.searchProvidersOnGrid.handle(null, nextProvidersPageToSearch.value);
  providers.value.push(...foundProviders.map(provider => useAddKeyFromIdentifier(provider)));
  canLoadMore.value = updatedCanLoadMore;
  nextProvidersPageToSearch.value += 1;

  loading.value = false;
};

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;
await useAsyncData(`load-providers`, () => onLoadData().then(() => true),
  { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <GridHeaderHorizontal
    v-show="loading || providers.length > 0"
    :can-load-more="canLoadMore"
    :data="providers"
    :slides-before-load="10"
    :columns="{
      sm: 2.7,
      md: 2.7,
      lg: 3.7,
      xl: 4.7,
    }"
    :slides-to-scroll="{
      sm: 2,
      md: 2,
      lg: 3,
      xl: 4,
    }"
    :loading="loading"
    :gap="2"
    aspect-ratio="8/3"
    @trigger:load="onLoadData"
  >
    <template #title>
      <GridHeaderTitle :title="t('grid.providers')" />
    </template>

    <!-- Commenting pending to decide where to take the user when clicking the "see all providers" -->
    <template #options>
      <BaseLink
        :to="{
          name: 'providers',
        }"
      >
        <BaseButton
          variant="subtle"
          size="sm"
        >
          {{ t("button.see_all") }}
        </BaseButton>
      </BaseLink>
    </template>

    <template #default="{ item: item }">
      <div class="group giro__sections justify-between w-full h-full">
        <div class="flex-1 rounded-lg overflow-hidden">
          <BaseLink
            :to="{
              name: 'providers-identifier',
              params: { identifier: item.identifier },
            }"
          >
            <ProviderImageLoader :provider-identifier="item.identifier" />
          </BaseLink>
        </div>

        <!-- Commenting until the endpoint returns how many games the provider has  -->
        <!-- <div class="w-full flex justify-center font-medium bg-button-primary text-transparent bg-clip-text">
          {{ t("grid.game_count", { count: 69 }) }}
        </div> -->
      </div>
    </template>
  </GridHeaderHorizontal>
</template>
