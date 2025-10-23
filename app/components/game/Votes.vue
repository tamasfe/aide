<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  gameIdentifier: string;
  authenticated: boolean;
}>();

const { n } = useI18n();
const gameModule = useGameModule();

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;

const { data, execute } = useAsyncData(`game-${props.gameIdentifier}-votes`, async () => {
  return await gameModule.ui.searchGameRatingFromGameFrameVotes.handle(props.gameIdentifier);
},
{
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
  transform: data => (
    data
      ? {
          likes: data.likes,
          dislikes: data.dislikes,
          ownRating: data.ownRating,
        }
      : null
  ),
});

const votes = computed(() => data.value ? data.value.likes + data.value.dislikes : null);

const likesPercentage = computed(() => data.value && votes.value && votes.value > 0 ? data.value.likes / votes.value : null);

const onClickVote = async (newRating: "like" | "dislike" | null) => {
  if (!props.authenticated) {
    return;
  }

  if (data.value?.ownRating === newRating) {
    newRating = null;
  }

  await gameModule.ui.rateGameFromGameFrameVotes.handle(props.gameIdentifier, newRating);

  await execute();
};
</script>

<template>
  <div
    :class="cn(
      'flex flex-row gap-3 items-center text-button-secondary',
      props.class,
    )"
  >
    <BaseButton
      variant="ghost"
      size="ghost"
      class="flex flex-row gap-1 items-center md:hover:text-subtle-light p-3 -m-2"
      :disabled="!authenticated"
      @click="onClickVote('dislike')"
    >
      <BaseIcon
        :class="{ 'text-emphasis': data?.ownRating === 'dislike' }"
        name="lucide:thumbs-down"
        :size="20"
      />
    </BaseButton>

    <div class="w-16 h-8 bg-white/5 rounded flex items-center justify-center">
      <div v-if="likesPercentage !== null" class="flex flex-col gap-1 leading-none whitespace-nowrap items-center text-sm text-center justify-center">
        <span class="font-medium tabular-nums">{{ n(likesPercentage, { style: "percent" }) }}</span>
      </div>
      <div v-if="likesPercentage == null && data">
        -
      </div>
    </div>
    <BaseButton
      variant="ghost"
      size="ghost"
      class="flex flex-row gap-1 items-center md:hover:text-subtle-light p-3 -m-2"
      :disabled="!authenticated"
      @click="onClickVote('like')"
    >
      <BaseIcon
        :class="{ 'text-emphasis fill-white': data?.ownRating === 'like' }"
        name="lucide:thumbs-up"
        :size="20"
      />
    </BaseButton>
  </div>
</template>
