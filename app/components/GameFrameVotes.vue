<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// DESIGN STATUS:       ✴️
//   * icons should be slightly bigger on mobile ONLY (gameframevotes should be refactored slightly to account for this)
//   * i think the look of the % / votes could look slightly better... maybe its font color?
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const props = defineProps<{
  class?: HTMLAttributes["class"];
  gameId: number;
}>();

const { n } = useI18n();
const { $dependencies } = useNuxtApp();
const userStore = useUserStore();

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const loading = ref(true);

const { data, refresh: refreshData } = await useAsyncData(`game-frame-votes-for-game-${props.gameId}`, async () => {
  loading.value = true;
  const result = await $dependencies.games.ui.searchGameRatingFromGameFrameVotes.handle(props.gameId);
  loading.value = false;
  return result;
},
{ lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);

const votes = computed<number>(() => {
  if (data.value?.likes === undefined || data.value?.dislikes === undefined) return 0;
  return data.value.likes + data.value.dislikes;
});
const likesPercentage = computed<number>(() => {
  if (data.value?.likes === undefined || data.value?.dislikes === undefined) return 0;
  const votes = data.value.likes + data.value.dislikes;
  return votes === 0 ? 0 : (data.value.likes / votes);
});
const rating = computed<"like" | "dislike" | null>(() => {
  if (!data || !data.value) return null;
  return data.value.rating;
});

const onClickVote = async (newRating: "like" | "dislike") => {
  if (!data || !data.value || loading.value) {
    return;
  }

  if (!userStore.isAuthenticated) {
    return;
  }

  loading.value = true;
  if (newRating === rating.value) {
    await $dependencies.games.ui.rateGameFromGameFrameVotes.handle(props.gameId, null);
  }
  else {
    await $dependencies.games.ui.rateGameFromGameFrameVotes.handle(props.gameId, newRating);
  }

  await refreshData();
  loading.value = false;
};
</script>

<template>
  <div
    :class="cn(
      'flex flex-row gap-2 items-center text-button-secondary',
      loading ? 'opacity-60' : 'opacity-100',
      props.class,
    )"
  >
    <BaseButton
      variant="ghost"
      size="ghost"
      class="flex flex-row gap-1 items-center hover:text-subtle-light"
      :disabled="userStore.isAuthenticated === false"
      @click="onClickVote('dislike')"
    >
      <BaseIcon
        :class="{ 'text-emphasis': rating === 'dislike' }"
        name="lucide:thumbs-down"
        :size="24"
      />
    </BaseButton>
    <div v-if="votes !== 0">
      <div class="flex flex-col gap-1 leading-none whitespace-nowrap items-center text-sm text-center justify-center">
        <span>{{ n(votes, { style: "decimal" }) }}</span>
        <span class="font-medium">{{ n(likesPercentage, { style: "percent" }) }}</span>
      </div>
    </div>
    <BaseButton
      variant="ghost"
      size="ghost"
      class="flex flex-row gap-1 items-center hover:text-subtle-light"
      :disabled="userStore.isAuthenticated === false"
      @click="onClickVote('like')"
    >
      <BaseIcon
        :class="{ 'text-emphasis': rating === 'like' }"
        name="lucide:thumbs-up"
        :size="24"
      />
    </BaseButton>
  </div>
</template>
