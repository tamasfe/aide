<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const { t } = useI18n();

const loading = ref(false);
const nextProvidersPageToSearch = useState(`grid-horizontal-providers-next-page`, () => 0);
const providerIds = useState<number[]>(`grid-horizontal-providers-ids`, () => []);
const canLoadMore = useState(`grid-horizontal-providers-can-load-more`, () => true);

const BLOCK_SERVER_SIDE_REQUEST = false;
const BLOCK_CLIENT_SIDE_REQUEST = false;

const onLoadData = async () => {
  if (!canLoadMore.value) return;
  if (loading.value) return;
  loading.value = true;

  const { providers: foundProviders, canLoadMore: updatedCanLoadMore } = await $dependencies.providers.ui.searchAllProvidersOnHorizontalGrid.handle(nextProvidersPageToSearch.value);
  providerIds.value.push(...foundProviders.map(game => game.id));
  canLoadMore.value = updatedCanLoadMore;
  nextProvidersPageToSearch.value += 1;

  loading.value = false;
};

await useAsyncData(`load-providers`, () => onLoadData().then(() => true), { lazy: !BLOCK_CLIENT_SIDE_REQUEST, server: BLOCK_SERVER_SIDE_REQUEST });
</script>

<template>
  <GridHeaderHorizontal
    v-show="providerIds.length > 0"
    :data="providerIds"
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
