<script setup lang="ts" generic="T extends unknown[]">
// STATUS:
// - Missing translations
import type { CSSProperties } from "vue";

const emit = defineEmits<{
  (e: "trigger:load"): void;
}>();

const onShowMore = () => {
  emit("trigger:load");
};

const props = withDefaults(
  defineProps<{
    data: T;
    pagination?: boolean;
    aspectRatio?: CSSProperties["aspectRatio"];
    max?: number;
  }>(),
  {
    pagination: false,
  },
);

const { data } = toRefs(props);

const max = computed(() => {
  return props.max !== undefined ? props.max : props.data.length;
});
</script>

<template>
  <div>
    <div class="grid grid-cols-2 sm:grid-cols-6 gap-4">
      <div
        v-for="(datapoint, index) in data"
        :key="index"
        :style="{
          aspectRatio: aspectRatio,
        }"
      >
        <slot :data="datapoint" />
      </div>
    </div>
    <div
      v-if="pagination"
      class="mt-10 flex flex-col justify-center items-center gap-4"
    >
      <div class="relative w-[12rem] h-1.5 rounded-full bg-emphasis">
        <div
          class="absolute left-0 top-0 h-1.5 bg-text-subtle rounded-full"
          :style="{ width: `${(data.length / max) * 100}%` }"
        />
      </div>
      <div class="text-subtle-light font-medium">
        {{ data.length }} of {{ max }}
      </div>
      <BaseButton
        v-if="data.length < max"
        variant="secondary"
        size="md"
        @click="onShowMore"
      >
        <div class="flex items-center gap-2">
          <div>Load More</div>
          <Icon
            name="lucide:chevron-down"
            size="24"
          />
        </div>
      </BaseButton>
    </div>
  </div>
</template>
