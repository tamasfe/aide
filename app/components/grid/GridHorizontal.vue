<script setup lang="ts" generic="T extends unknown[]">
// STATUS:
// TODO: Add overflow type based on the prop
import { useBreakpoints, useInfiniteScroll } from "@vueuse/core";
import type { CSSProperties } from "vue";

export type GridHorizontalBreakpoints = "sm" | "md" | "lg" | "xl";
export type GridHorizontalBreakpointValues = Record<
  GridHorizontalBreakpoints,
  number
>;
export type GridHorizontalDirection = "ltr" | "rtl";
export type GridHorizontalProps<T> = {
  data: T;
  slidesToScroll: GridHorizontalBreakpointValues;
  columns: GridHorizontalBreakpointValues;
  aspectRatio: CSSProperties["aspectRatio"];
  animationDuration?: number;
  manualScroll?: boolean;
  direction?: GridHorizontalDirection;
  canLoadMore?: boolean;
  distance?: number;
  loading?: boolean;
  gap?: number;
};

const props = withDefaults(defineProps<GridHorizontalProps<T>>(), {
  loading: false,
  gap: 1,
  canLoadMore: false,
  distance: 1800,
  direction: "ltr",
  manualScroll: true,
  animationDuration: 350,
});

const emit = defineEmits<{
  (e: "trigger:load"): void;
}>();

const { data } = toRefs(props);

const container = ref<HTMLElement | null>(null);

// Not using tailwind breakpoints as we want
// sm to actually be from 0-640px and not starting from 640px
const breakpoints = useBreakpoints({
  sm: 0,
  md: 640,
  lg: 1024,
  xl: 1280,
});
const activeBreakpoint = breakpoints.active();

const isBeginning = ref(true);
const isEnd = ref(false);
const isAnimating = ref(false);

const columnSizes = computed(() => {
  const { columns, gap } = props;
  return Object.keys(columns).reduce(
    (sizes, key) => {
      const column = columns[key as keyof GridHorizontalBreakpointValues];
      const numberOfGaps = Math.ceil(column) - 1;
      sizes[key as keyof GridHorizontalBreakpointValues]
        = `calc((100% - ${numberOfGaps * gap}rem)/${column})`;
      return sizes;
    },
    {} as Record<keyof GridHorizontalBreakpointValues, string>,
  );
});

const calculateScrollPosition = () => {
  if (!container.value) return;
  if (props.direction === "ltr") {
    isBeginning.value = container.value.scrollLeft <= 1;
    const maxWidth = container.value.scrollLeft + container.value.getBoundingClientRect().width;
    isEnd.value = Math.round(maxWidth) >= Math.round(container.value.scrollWidth) - 10;
    return;
  }
  const maxWidth = container.value.scrollLeft - container.value.getBoundingClientRect().width;
  isEnd.value = Math.round(maxWidth) <= Math.round(-container.value.scrollWidth) + 10;
  isBeginning.value = container.value.scrollLeft >= -1;
};

const onScroll = () => {
  // recalculate if we're at the beginning or end
  calculateScrollPosition();
};

const scrollForward = () => {
  if (isEnd.value || isAnimating.value) return;
  if (container.value) {
    const slideWidth = container.value.children[0]?.getBoundingClientRect().width;
    if (!slideWidth) return;
    const gap = parseInt(getComputedStyle(container.value).gap, 10);
    const numberOfColumnsToScroll = props.slidesToScroll[
      activeBreakpoint.value as keyof GridHorizontalBreakpointValues
    ];
    let value = container.value.scrollLeft + (slideWidth + gap) * numberOfColumnsToScroll;
    if (props.direction === "rtl") {
      value = container.value.scrollLeft - (slideWidth + gap) * numberOfColumnsToScroll;
    }
    scrollToPosition(value, props.animationDuration);
  }
};

const scrollBack = () => {
  if (isBeginning.value || isAnimating.value) return;
  if (container.value) {
    const slideWidth = container.value.children[0]?.getBoundingClientRect().width;
    if (!slideWidth) return;
    const gap = parseInt(getComputedStyle(container.value).gap, 10);
    const numberOfColumnsToScroll = props.slidesToScroll[
      activeBreakpoint.value as keyof GridHorizontalBreakpointValues
    ];
    let value = container.value.scrollLeft - (slideWidth + gap) * numberOfColumnsToScroll;
    if (props.direction === "rtl") {
      value = container.value.scrollLeft + (slideWidth + gap) * numberOfColumnsToScroll;
    }
    scrollToPosition(value, props.animationDuration);
  }
};

const scrollToTheEnd = () => {
  if (container.value) {
    const gap = parseInt(getComputedStyle(container.value).gap, 10);
    let value = container.value.scrollWidth + gap;
    if (props.direction === "rtl") {
      value = -container.value.scrollWidth - gap;
    }
    scrollToPosition(value, props.animationDuration);
  }
};

const scrollToTheBeginning = () => {
  if (container.value) {
    const value = 0;
    scrollToPosition(value, props.animationDuration);
  }
};

const onLoadMore = () => {
  if (props.loading) return;
  emit("trigger:load");
};

// TODO: should we have a prop for this?
const initInfiniteScrolling = () => {
  if (!container.value) return;
  useInfiniteScroll(container.value, onLoadMore, {
    direction: "right",
    distance: props.distance,
    interval: 100,
    // determines if there's more data to load
    canLoadMore: () => {
      return props.canLoadMore;
    },
  });
};

onMounted(() => {
  if (container.value) {
    container.value.addEventListener("scroll", onScroll);
    calculateScrollPosition();
    const mutationObserver = new MutationObserver(calculateScrollPosition);
    mutationObserver.observe(container.value, { childList: true });

    initInfiniteScrolling();
  }
});

onBeforeUnmount(() => {
  if (container.value) {
    container.value.removeEventListener("scroll", onScroll);
  }
});

const easeOutQuad = (t: number, b: number, c: number, d: number): number => {
  t /= d;
  return -c * t * (t - 2) + b;
};

const scrollToPosition = (target: number, duration: number) => {
  if (!container.value) return;

  const start = container.value.scrollLeft;
  const change = target - start;
  let currentTime = 0;
  const increment = 20;
  isAnimating.value = true;

  const animateScroll = () => {
    currentTime += increment;
    const val = easeOutQuad(currentTime, start, change, duration);
    if (container.value) {
      container.value.scrollLeft = val;
    }
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    }
    else {
      isAnimating.value = false;
    }
  };

  animateScroll();
};

defineExpose({
  scrollForward,
  scrollBack,
  isBeginning,
  isEnd,
  scrollToTheEnd,
  scrollToTheBeginning,
});
</script>

<template>
  <div
    ref="container"
    class="w-full flex items-center overflow-auto no-scrollbar giro__grid-horizontal-container"
    :style="{
      gap: `${gap}rem`,
      direction: direction,
      overflowX: manualScroll ? 'auto' : 'hidden',
    }"
  >
    <div
      v-for="(item, index) in data"
      :key="index"
      class="giro__grid-horizontal-item w-full flex-shrink-0"
      :style="{ aspectRatio: aspectRatio }"
    >
      <slot :item="item" />
    </div>
    <div
      v-if="loading"
      class="giro__grid-horizontal-item w-full h-full flex-shrink-0"
      :style="{ aspectRatio: aspectRatio }"
    >
      <slot name="loading" />
    </div>
  </div>
</template>

<style scoped>
.giro__grid-horizontal-item {
  flex-basis: v-bind("columnSizes.sm");
}

@media (min-width: 640px) {
  .giro__grid-horizontal-item {
    flex-basis: v-bind("columnSizes.md");
  }
}

@media (min-width: 768px) {
  .giro__grid-horizontal-item {
    flex-basis: v-bind("columnSizes.lg");
  }
}

@media (min-width: 1024px) {
  .giro__grid-horizontal-item {
    flex-basis: v-bind("columnSizes.xl");
  }
}
</style>
