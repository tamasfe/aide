<script setup lang="ts" generic="T extends {key:string}[]">
import type { CSSProperties } from "vue";
import type { BreakpointValues } from "~/types/utils";

export type GridHorizontalDirection = "ltr" | "rtl";
export type GridHorizontalProps<T> = {
  data: T;
  slidesToScroll?: BreakpointValues;
  columns: BreakpointValues;
  aspectRatio: CSSProperties["aspectRatio"];
  duration?: number;
  manualScroll?: boolean;
  direction?: GridHorizontalDirection;
  canLoadMore?: boolean;
  loading?: boolean;
  slidesBeforeLoad?: number;
  gap?: number;
};

const props = withDefaults(defineProps<GridHorizontalProps<T>>(), {
  loading: false,
  gap: 0.56,
  canLoadMore: false,
  duration: 30,
});

const emit = defineEmits<{
  (e: "trigger:load"): void;
}>();

const { data } = toRefs(props);

// NOTE: this component is using any for ref template of grid because generic types are not properly supported current version of Vue, so we have to use any type. when https://github.com/vuejs/language-tools/issues/3206 is fixed we SHOULD change this to respective type
// eslint-disable-next-line
const slider = ref<any>(null);

const scrollNext = () => {
  if (slider.value) {
    slider.value.scrollNext();
  }
};

const scrollPrev = () => {
  if (slider.value) {
    slider.value.scrollPrev();
  }
};

const canScrollNext = computed(() => slider.value?.canScrollNext);
const canScrollPrev = computed(() => slider.value?.canScrollPrev);

defineExpose({
  scrollNext,
  scrollPrev,
  canScrollNext,
  canScrollPrev,
});
</script>

<template>
  <BaseSlider
    ref="slider"
    class="w-full"
    :style="{
      direction: props.direction,
    }"
    :data="data"
    :gap="gap"
    :slides="columns"
    :loading="loading"
    :can-load-more="canLoadMore"
    :slides-before-load="slidesBeforeLoad"
    :manual-scroll="manualScroll"
    @trigger:load="emit('trigger:load')"
  >
    <template #default="{ item }">
      <div
        class="w-full flex-shrink-0"
        :style="{ aspectRatio: aspectRatio }"
      >
        <slot :item="item" />
      </div>
    </template>
    <template #loading>
      <div
        class="w-full flex-shrink-0"
        :style="{ aspectRatio: aspectRatio }"
      >
        <slot name="loading" />
      </div>
    </template>
  </BaseSlider>
</template>
