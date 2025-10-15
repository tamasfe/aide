<script setup lang="ts">
import type { Provider } from "~/modules/providers/domain/Provider";
import type { Keyified } from "~/types/utils";

const { $dependencies } = useNuxtApp();
const { navigateBackOrHome } = useNavigateBackOrHome();
const { t } = useI18n();

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;

const loading = useState(`grid-vertical-providers-loading`, () => true);
const totalProviders = useState(`grid-vertical-providers-total`, () => 0);
const nextProvidersPageToSearch = useState(`grid-vertical-providers-next-page`, () => 0);
const providers = useState<Keyified<Provider>[]>(`grid-vertical-providers-ids`, () => []);
const canLoadMore = useState(`grid-vertical-providers-can-load-more`, () => true);

const onLoadData = async () => {
  if (!canLoadMore.value) return;
  loading.value = true;

  const { game_providers: foundProviders, canLoadMore: updatedCanLoadMore, totalProviders: total } = await $dependencies.providers.ui.listProvidersOnGrid.handle(nextProvidersPageToSearch.value);
  providers.value.push(...foundProviders.map(provider => useAddKeyFromIdentifier(provider)));
  canLoadMore.value = updatedCanLoadMore;
  nextProvidersPageToSearch.value += 1;
  totalProviders.value = total;

  loading.value = false;
};

useAsyncData(`load-vertical-providers`, onLoadData,
  { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING, default: () => true },
);
</script>

<template>
  <section>
    <GridHeader class="mb-4">
      <template #title>
        <div class="flex gap-4 items-center">
          <BaseButton
            variant="subtle"
            size="sm"
            class="p-1.5"
            @click="navigateBackOrHome"
          >
            <BaseIcon
              name="lucide:arrow-left"
              :size="24"
            />
          </BaseButton>

          <GridHeaderTitle :title="t('grid.providers')" />
        </div>
      </template>

      <template #options />
    </GridHeader>

    <GridVertical
      aspect-ratio="8/3"
      :columns="{ sm: 2, md: 2, lg: 3, xl: 4 }"
      :data="providers"
      :gap="2"
      pagination
      :loading="loading"
      :total-count="totalProviders"
      @trigger:load="onLoadData"
    >
      <template #default="{ data: item }">
        <NuxtLinkLocale
          :to="{
            name: 'games-provider',
            params: {
              provider: item.identifier,
            },
          }"
          class="flex-1 rounded-lg overflow-hidden"
        >
          <ProviderImageLoader :provider-identifier="item.identifier" />
        </NuxtLinkLocale>
      </template>
    </GridVertical>
  </section>
</template>
