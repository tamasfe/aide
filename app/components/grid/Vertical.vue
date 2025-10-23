<script setup lang="ts" generic="T extends {key: string}[]">
// STATUS:
// - Missing translations
import type { CSSProperties } from "vue";
import type { BreakpointValues } from "~/types/utils";

const emit = defineEmits<{
  (e: "trigger:load"): void;
}>();

const onShowMore = () => {
  emit("trigger:load");
};

const props = withDefaults(
  defineProps<{
    columns: BreakpointValues;
    data: T;
    gap?: number;
    pagination?: boolean;
    aspectRatio?: CSSProperties["aspectRatio"];
    totalCount?: number;
    loading?: boolean;
  }>(), {
    pagination: false,
    gap: 0.56,
  },
);

const totalCount = computed(() => {
  return props.totalCount !== undefined ? props.totalCount : props.data.length;
});

const SKELETON_ITEMS_TO_SHOW = 24;
const dataLoadingSkeleton: { key: string; isSkeleton?: boolean }[] = Array.from({ length: SKELETON_ITEMS_TO_SHOW }).map((_elem, index) => ({ key: String(index), isSkeleton: true }));

const dataToRender = computed<(T[number] & { isSkeleton?: boolean })[]>(() => {
  if (props.loading === undefined) {
    return props.data;
  }

  if (props.loading === true) {
    return props.data.concat(dataLoadingSkeleton);
  }

  return props.data;
});
</script>

<template>
  <div>
    <div
      class="grid gap-2 md:gap-4 grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 pt-1"
    >
      <div
        v-for="(datapoint) in dataToRender"
        :key="datapoint.key"
        :style="{ aspectRatio: aspectRatio }"
      >
        <slot v-if="datapoint.isSkeleton" name="loading">
          <BaseSkeleton :loading="true" class="h-full w-full" />
        </slot>
        <slot v-else :data="datapoint" />
      </div>
    </div>
    <div
      v-if="pagination && data.length < totalCount"
      class="mt-10 flex flex-col justify-center items-center gap-4"
    >
      <div class="relative w-[12rem] h-1.5 rounded-full bg-emphasis">
        <div
          class="absolute left-0 top-0 h-1.5 bg-text-subtle rounded-full"
          :style="{ width: `${(data.length / totalCount) * 100}%` }"
        />
      </div>
      <div class="text-subtle-light font-medium">
        {{ data.length }} of {{ totalCount }}
      </div>
      <BaseButton
        variant="secondary"
        size="md"
        @click="onShowMore"
      >
        <div class="flex items-center gap-2">
          <div>Load More</div>
          <BaseIcon name="lucide:chevron-down" :size="24" />
        </div>
      </BaseButton>
    </div>
  </div>
</template>
