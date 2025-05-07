<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{
  itemType: "game" | "provider";
  items: { identifier: string; key: string }[];
  totalResults: number;
  onLoadMore: () => Promise<void>;
  loading?: boolean;
}>();

const itemTypeToAspectRatio = {
  game: "3/4",
  provider: "9/3",
};

const itemTypeToColumns = {
  game: { sm: 3, md: 4, lg: 6, xl: 8 },
  provider: { sm: 2, md: 2, lg: 3, xl: 4 },
};

// For some reason TS recognizes that only a string can be returned, but the eslint rule breaks anyway. So we disable the eslint rule.
// eslint-disable-next-line vue/return-in-computed-property
const title: ComputedRef<string> = computed(() => {
  switch (props.itemType) {
    case "game":
      return t("search.number_of_results_games", { total: props.totalResults });
    case "provider":
      return t("search.number_of_results_providers", { total: props.totalResults });
  }
});
</script>

<template>
  <GridHeader>
    <template #title>
      <div class="flex gap-4 items-center">
        <GridHeaderTitle :title="title" />
      </div>
    </template>

    <GridVertical
      :data="items"
      :columns="itemTypeToColumns[itemType]"
      :aspect-ratio="itemTypeToAspectRatio[itemType]"
      pagination
      :total-count="totalResults"
      :loading="loading"
      @trigger:load="onLoadMore"
    >
      <template #default="{ data: data }">
        <slot :item="data" />
      </template>
    </GridVertical>
  </GridHeader>
</template>
