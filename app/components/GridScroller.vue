<script setup lang="ts" generic="T extends unknown[]">
// DESIGN STATUS:        ✴️
//   * didnt do audit of css
// ARCHITECTURE STATUS:  ✴️
//   * TODO add server side rendering support
//   * do not use 'any' anywhere in app
// TRANSLATION STATUS:   ✅
import { useBreakpoints } from "@vueuse/core";
import type { CSSProperties } from "vue";

export type GridScrollerBreakpoints = "sm" | "md" | "lg" | "xl";
export type GridScrollerBreakpointValues = Record<
  GridScrollerBreakpoints,
  number
>;
export type GridScrollerAspectRatioValues = Record<
  GridScrollerBreakpoints,
  CSSProperties["aspectRatio"]
>;

const emit = defineEmits(["click:nextPage", "click:previousPage"]);

const props = withDefaults(
  defineProps<{
    data: T;
    slidesToScroll: GridScrollerBreakpointValues;
    columns: GridScrollerBreakpointValues;
    showControls?: boolean;
    loading?: boolean;
    aspectRatios?: GridScrollerAspectRatioValues;
    itemClass?: string;
    gap?: number;
  }>(),
  {
    showControls: true,
    loading: false,
    gap: 1,
    aspectRatios: () => ({
      sm: "auto",
      md: "auto",
      lg: "auto",
      xl: "auto",
    }),
  },
);

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
      const column = columns[key as keyof GridScrollerBreakpointValues];
      const numberOfGaps = Math.ceil(column) - 1;
      sizes[key as keyof GridScrollerBreakpointValues]
        = `calc((100% - ${numberOfGaps * gap}rem)/${column})`;
      return sizes;
    },
    {} as Record<keyof GridScrollerBreakpointValues, string>,
  );
});

const onScroll = () => {
  if (container.value) {
    isBeginning.value = container.value.scrollLeft <= 1;
    const maxWidth
      = container.value.scrollLeft
      + container.value.getBoundingClientRect().width;
    isEnd.value
      = Math.round(maxWidth) >= Math.round(container.value.scrollWidth) - 10;
  }
};

const nextPage = () => {
  if (isEnd.value || isAnimating.value) return;
  if (container.value) {
    const slideWidth
      = container.value.children[0]?.getBoundingClientRect().width;
    const gap = parseInt(getComputedStyle(container.value).gap, 10);
    const numberOfColumnsToScroll
      = props.slidesToScroll[
        activeBreakpoint.value as keyof GridScrollerBreakpointValues
      ];
    const value
      = container.value.scrollLeft + (slideWidth + gap) * numberOfColumnsToScroll;
    scrollToPosition(value, 350);
  }
  emit("click:nextPage");
};

const previousPage = () => {
  if (isBeginning.value || isAnimating.value) return;
  if (container.value) {
    const slideWidth
      = container.value.children[0]?.getBoundingClientRect().width;
    const gap = parseInt(getComputedStyle(container.value).gap, 10);
    const numberOfColumnsToScroll
      = props.slidesToScroll[
        activeBreakpoint.value as keyof GridScrollerBreakpointValues
      ];
    const value
      = container.value.scrollLeft - (slideWidth + gap) * numberOfColumnsToScroll;
    scrollToPosition(value, 350);
  }
  emit("click:previousPage");
};

onMounted(() => {
  if (container.value) {
    container.value.addEventListener("scroll", onScroll);
    onScroll();
    const mutationObserver = new MutationObserver(onScroll);
    mutationObserver.observe(container.value, { childList: true });
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
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-x-8">
        <div class="text-3xl font-bold">
          <slot name="title" />
        </div>
        <div
          v-if="showControls && !loading"
          class="flex items-center gap-x-4 text-3xl font-bold cursor-pointer"
        >
          <BaseButton
            variant="subtle"
            size="sm"
            class="p-1.5"
            :disabled="isBeginning"
            @click="previousPage"
          >
            <Icon
              name="lucide:chevron-left"
              size="24"
            />
          </BaseButton>
          <BaseButton
            variant="subtle"
            size="sm"
            class="p-1.5"
            :disabled="isEnd"
            @click="nextPage"
          >
            <Icon
              name="lucide:chevron-right"
              size="24"
            />
          </BaseButton>
        </div>
      </div>
      <slot name="options" />
    </div>
    <div
      ref="container"
      class="w-full flex items-center overflow-auto sm:overflow-hidden no-scrollbar giro__grid-scroller-container"
      :style="{
        gap: `${gap}rem`,
      }"
    >
      <div
        v-for="(item, index) in data"
        :key="index"
        class="giro__grid-scroller-item w-full h-full flex-shrink-0"
      >
        <slot :item="item" />
      </div>
      <div
        v-if="$slots.loading"
        class="giro__grid-scroller-item w-full h-full flex-shrink-0"
      >
        <slot name="loading" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.giro__grid-scroller-item {
  flex-basis: v-bind("columnSizes.sm");
}
.giro__grid-scroller-container {
  aspect-ratio: v-bind("aspectRatios.sm");
}

@media (min-width: 640px) {
  .giro__grid-scroller-item {
    flex-basis: v-bind("columnSizes.md");
  }
  .giro__grid-scroller-container {
    aspect-ratio: v-bind("aspectRatios.md");
  }
}

@media (min-width: 768px) {
  .giro__grid-scroller-item {
    flex-basis: v-bind("columnSizes.lg");
  }
  .giro__grid-scroller-container {
    aspect-ratio: v-bind("aspectRatios.lg");
  }
}

@media (min-width: 1024px) {
  .giro__grid-scroller-item {
    flex-basis: v-bind("columnSizes.xl");
  }
  .giro__grid-scroller-container {
    aspect-ratio: v-bind("aspectRatios.xl");
  }
}
</style>
