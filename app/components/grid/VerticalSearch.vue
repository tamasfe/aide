<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  gameIds: number[];
  totalResults: number;
  onLoadMore: () => Promise<void>;
}>();
</script>

<template>
  <GridHeader>
    <template #title>
      <div class="flex gap-4 items-center">
        <GridHeaderTitle :title="t('search.number_of_results', { total: totalResults })" />
      </div>
    </template>

    <GridVertical
      :data="gameIds"
      :columns="{ sm: 3, md: 4, lg: 6, xl: 8 }"
      aspect-ratio="3/4"
      pagination
      :total-count="totalResults"
      @trigger:load="onLoadMore"
    >
      <template #default="{ data: gameId }">
        <NuxtLink
          :to="`/games/${gameId}`"
          class="block bg-subtle rounded-default w-full h-full overflow-hidden"
        >
          <GamesImageLoader :game-id="gameId" />
        </NuxtLink>
      </template>
    </GridVertical>
  </GridHeader>
</template>
