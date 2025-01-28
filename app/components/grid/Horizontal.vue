<script setup lang="ts" generic="T extends {key:string}[]">
import type { EmblaOptionsType } from "embla-carousel";
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

const { data, slidesToScroll } = toRefs(props);

// NOTE: this component is using any for ref template of grid because generic types are not properly supported current version of Vue, so we have to use any type. when https://github.com/vuejs/language-tools/issues/3206 is fixed we SHOULD change this to respective type
// eslint-disable-next-line
const slider = ref<any>(null);

const sliderOptions = computed<EmblaOptionsType>(() => {
  return {
    slidesToScroll: slidesToScroll.value?.sm,
    duration: props.duration,
    align: "start",
    dragFree: true,
    containScroll: "keepSnaps",
    direction: props.direction,
    breakpoints: {
      "(min-width: 640px)": {
        slidesToScroll: slidesToScroll.value?.md,
      },
      "(min-width: 768px)": {
        slidesToScroll: slidesToScroll.value?.lg,
      },
      "(min-width: 1024px)": {
        slidesToScroll: slidesToScroll.value?.xl,
      },
    },
  };
});

const scrollNext = () => {
  if (slider.value) {
    const emblaApi = slider.value.emblaApi;
    emblaApi?.scrollNext();
  }
};

const scrollPrev = () => {
  if (slider.value) {
    const emblaApi = slider.value.emblaApi;
    emblaApi?.scrollPrev();
  }
};

const canScrollNext = computed(() => slider.value.canScrollNext);
const canScrollPrev = computed(() => slider.value.canScrollPrev);

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
    :options="sliderOptions"
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
