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

  const { game_providers: foundProviders, canLoadMore: updatedCanLoadMore } = await $dependencies.providers.ui.listProvidersOnGrid.handle(nextProvidersPageToSearch.value);
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

// eslint-disable-next-line
const slider = ref<any>(null);

const scrollPrev = () => {
  slider.value?.scrollPrev();
};

const scrollNext = () => {
  slider.value?.scrollNext();
};

const canScrollPrev = computed(() => {
  if (!slider.value) return false;
  return slider.value.canScrollPrev;
});

const canScrollNext = computed(() => {
  if (!slider.value) return false;
  return slider.value.canScrollNext;
});
</script>

<template>
  <section class="w-full max-w-screen-xl mx-auto">
    <GridHeader class="px-4 mb-2">
      <template #title>
        <div class="flex gap-6 items-center">
          <GridHeaderTitle :title="t('grid.providers')" />

          <div
            class="hidden md:flex items-center gap-x-4 text-3xl font-bold cursor-pointer"
          >
            <BaseButton
              variant="subtle"
              size="sm"
              class="p-1.5"
              :disabled="!canScrollPrev"
              @click="scrollPrev"
            >
              <BaseIcon
                name="lucide:chevron-left"
                :size="24"
              />
            </BaseButton>
            <BaseButton
              variant="subtle"
              size="sm"
              class="p-1.5"
              :disabled="!canScrollNext"
              @click="scrollNext"
            >
              <BaseIcon
                name="lucide:chevron-right"
                :size="24"
              />
            </BaseButton>
          </div>
        </div>
      </template>

      <template #options>
        <BaseLink
          :to="{ name: 'categories-id', params: { name: 'providers' } }"
        >
          <BaseButton
            variant="subtle"
            size="sm"
          >
            {{ $t("button.see_all") }}
          </BaseButton>
        </BaseLink>
      </template>
    </GridHeader>

    <BaseSlider
      ref="slider"
      :data="providers"
      :loading="loading"
      class="w-full"
      @trigger:load="onLoadData"
    >
      <template #default="{ item }">
        <div class="group justify-between w-full h-full mt-2">
          <div class="flex-1 rounded-lg overflow-hidden">
            <BaseLink
              :to="{
                name: 'games-provider',
                params: { provider: item.identifier },
              }"
            >
              <ProviderImageLoader :provider-identifier="item.identifier" />
            </BaseLink>
          </div>
        </div>
      </template>
    </BaseSlider>
  </section>
</template>
