<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const { navigateBackOrHome } = useNavigateBackOrHome();
const { t } = useI18n();

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const loading = useState(`grid-vertical-providers-loading`, () => true);
const totalProviders = useState(`grid-vertical-providers-total`, () => 0);
const nextProvidersPageToSearch = useState(`grid-vertical-providers-next-page`, () => 0);
const providers = useState<{ id: number; imageUrl: string }[]>(`grid-vertical-providers-ids`, () => []);
const canLoadMore = useState(`grid-vertical-providers-can-load-more`, () => true);

const onLoadData = async () => {
  if (!canLoadMore.value) return;
  loading.value = true;

  const { providers: foundProviders, canLoadMore: updatedCanLoadMore, totalProviders: total } = await $dependencies.providers.ui.searchProvidersOnGrid.handle(null, nextProvidersPageToSearch.value);
  providers.value.push(...foundProviders);
  canLoadMore.value = updatedCanLoadMore;
  nextProvidersPageToSearch.value += 1;
  totalProviders.value = total;

  loading.value = false;
};

await useAsyncData(`load-vertical-providers`, () => onLoadData().then(() => true),
  { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <GridHeader>
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

    <template #options>
      <!-- TODO: allow options for search
      <div class="w-full max-w-[12rem]">
        <BaseSelect size="sm" />
      </div> -->
    </template>
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
        <BaseLink
          :to="{
            name: 'providers-id',
            params: {
              id: item.id,
            },
          }"
          class="flex-1 rounded-[0.7rem] overflow-hidden"
        >
          <ProviderImageLoader :src="item.imageUrl" :provider-id="item.id" />
        </BaseLink>
      </template>
    </GridVertical>
  </GridHeader>
</template>
