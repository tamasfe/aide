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
      class="flex justify-center items-center flex-col gap-4 mt-4"
    >
      <div
        class="relative w-1/2 md:w-[20%] lg:w-[15%] h-1.5 rounded-lg bg-emphasis"
      >
        <div
          class="absolute left-0 top-0 h-1.5 bg-text-subtle rounded-lg"
          :style="{ width: `${(data.length / max) * 100}%` }"
        />
      </div>
      <p class="text-emphasis font-medium text-xl sm:text-base">
        {{ data.length }} of {{ max }}
      </p>
      <BaseButton
        v-if="data.length < max"
        class="bg-emphasis inline-flex justify-center text-subtle hover:text-emphasis w-full sm:w-max text-base font-medium px-4 py-3 sm:px-6 sm:py-2.5 rounded-md"
        big
        @click="onShowMore"
      >
        <div class="inline-flex items-center gap-x-2">
          <p class="text-xl sm:text-base">Show more</p>
          <Icon
            name="lucide:chevron-down"
            :size="24"
          />
        </div>
      </BaseButton>
    </div>
  </div>
</template>
