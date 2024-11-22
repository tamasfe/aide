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
  authenticated: boolean;
}>();

const { n } = useI18n();
const { $dependencies } = useNuxtApp();

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const initialLoading = ref(true);
const likes = ref<number>(0);
const dislikes = ref<number>(0);
const rating = ref<"like" | "dislike" | null>(null);

await useAsyncData(`game-frame-votes-for-game-${props.gameId}`, async () => {
  initialLoading.value = true;
  const result = await $dependencies.games.ui.searchGameRatingFromGameFrameVotes.handle(props.gameId);
  if (!result) return null;

  likes.value = result.likes;
  dislikes.value = result.dislikes;
  rating.value = result.rating;

  initialLoading.value = false;
  return result;
},
{ lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);

const votes = computed<number>(() => likes.value + dislikes.value);
const likesPercentage = computed<number>(() => votes.value === 0 ? 0 : (likes.value / votes.value));

const onClickVote = async (newRating: "like" | "dislike") => {
  if (!props.authenticated) {
    return;
  }

  if (newRating === rating.value) {
    rating.value = null;
    if (newRating === "like") likes.value -= 1;
    if (newRating === "dislike") dislikes.value -= 1;
    $dependencies.games.ui.rateGameFromGameFrameVotes.handle(props.gameId, null);
  }
  else {
    if (newRating === "like") {
      likes.value += 1;
      if (rating.value === "dislike") dislikes.value -= 1;
    };
    if (newRating === "dislike") {
      dislikes.value += 1;
      if (rating.value === "like") likes.value -= 1;
    }

    rating.value = newRating;
    $dependencies.games.ui.rateGameFromGameFrameVotes.handle(props.gameId, newRating);
  }
};
</script>

<template>
  <div
    :class="cn(
      'flex flex-row gap-2 items-center text-button-secondary',
      initialLoading ? 'opacity-60' : 'opacity-100',
      props.class,
    )"
  >
    <BaseButton
      variant="ghost"
      size="ghost"
      class="flex flex-row gap-1 items-center hover:text-subtle-light"
      :disabled="authenticated === false"
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
      :disabled="authenticated === false"
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
