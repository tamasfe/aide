<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  itemType: "game" | "provider";
  itemIds: number[];
  totalResults: number;
  onLoadMore: () => Promise<void>;
  loading?: boolean;
}>();

const itemTypeToAspectRatio = {
  game: "3/4",
  provider: "16/9",
};

const itemTypeToColumns = {
  game: { sm: 3, md: 4, lg: 6, xl: 8 },
  provider: { sm: 2, md: 2, lg: 3, xl: 3 },
};
</script>

<template>
  <GridHeader>
    <template #title>
      <div class="flex gap-4 items-center">
        <GridHeaderTitle :title="t('search.number_of_results', { total: totalResults })" />
      </div>
    </template>

    <GridVertical
      :data="itemIds"
      :columns="itemTypeToColumns[itemType]"
      :aspect-ratio="itemTypeToAspectRatio[itemType]"
      pagination
      :total-count="totalResults"
      :loading="loading"
      @trigger:load="onLoadMore"
    >
      <template #default="{ data: itemId }">
        <slot :item-id="itemId" />
      </template>
    </GridVertical>
  </GridHeader>
</template>
