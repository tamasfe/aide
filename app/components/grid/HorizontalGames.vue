<script setup lang="ts">
import type { Game } from "~/modules/games/domain/Game";
import type { Keyified } from "~/types/utils";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  categoryIdentifier: string;
  initialGames?: Game[];
}>();

const gameModule = useGameModule();
const { t } = useI18n();

const paginationSize = computed(() => props.initialGames ? props.initialGames.length : 25);

const games = useState<(Keyified<Game>)[]>(`grid-horizontal-games-ids-for-${props.categoryIdentifier}`, () => props.initialGames ? props.initialGames.map(game => useAddKeyFromIdentifier(game)) : []);
const loading = useState(`grid-horizontal-games-loading-for-${props.categoryIdentifier}`, () => false);
const nextGamesPageToSearch = useState(`grid-horizontal-games-next-page-for-${props.categoryIdentifier}`, () => props.initialGames ? 1 : 0);
const canLoadMore = useState(`grid-horizontal-games-can-load-more-for-${props.categoryIdentifier}`, () => true);

const onLoadData = async () => {
  if (!canLoadMore.value) return;

  loading.value = true;

  const { games: gamesFound, canLoadMore: updatedCanLoadMore } = await gameModule.ui.listGamesPaginatingOnGrid.handle(props.categoryIdentifier, null, nextGamesPageToSearch.value, paginationSize.value);
  games.value.push(...gamesFound.map(game => useAddKeyFromIdentifier(game)));
  canLoadMore.value = updatedCanLoadMore;
  nextGamesPageToSearch.value += 1;

  loading.value = false;
};

if (!props.initialGames) {
  const ENABLE_SERVER_SIDE_RENDERING = true;
  const DEFER_CLIENT_SIDE_LOADING = true;
  useAsyncData(`load-games-for-horizontal-${props.categoryIdentifier}`,
    () => onLoadData().then(() => true),
    { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
  );
}

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
  <GridHeader class="mb-2">
    <template #title>
      <div class="flex gap-6 items-center">
        <GridHeaderTitle :title="t(`category.${categoryIdentifier}`)" />

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
      <NuxtLinkLocale
        :to="{ name: 'categories-identifier', params: { identifier: props.categoryIdentifier } }"
      >
        <BaseButton
          variant="subtle"
          size="sm"
        >
          {{ $t("button.see_all") }}
        </BaseButton>
      </NuxtLinkLocale>
    </template>
  </GridHeader>

  <BaseSlider
    v-bind="$attrs"
    ref="slider"
    class="-mx-4"
    :data="games"
    :can-load-more="canLoadMore"
    @trigger:load="onLoadData"
  >
    <template #default="{ item: game, index }">
      <div class="pt-1 h-full">
        <GameImageLink
          :fetchpriority="index < 3 ? 'high' : 'low'"
          :identifier="game.identifier"
          :animation-on-hover="'vertical-translate'"
        />
      </div>
    </template>
  </BaseSlider>
</template>
