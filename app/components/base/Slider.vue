<script setup lang="ts" generic="T extends Array<{ key: string } | undefined>">
import { useScroll, useInfiniteScroll } from "@vueuse/core";

const emit = defineEmits<{
  (e: "trigger:load"): void;
}>();

const props = withDefaults(
  defineProps<{
    gap?: number;
    data: T;
    loading?: boolean;
    canLoadMore?: boolean;
    slidesBeforeLoad?: number;
  }>(),
  {
    loading: false,
    gap: 1,
    canLoadMore: false,
    slidesBeforeLoad: 1,
  },
);

const { loading, canLoadMore } = toRefs(props);
const sliderContainer = ref<HTMLElement>();

// Use VueUse for scroll tracking
const { arrivedState } = useScroll(sliderContainer, { behavior: "smooth" });

// Use VueUse infinite scroll for loading additional elements
useInfiniteScroll(
  sliderContainer,
  () => {
    if (canLoadMore.value && !loading.value) {
      emit("trigger:load");
    }
  },
  {
    direction: "right",
    distance: 100, // Distance in pixels from the right edge
  },
);

// Navigation state using VueUse arrivedState
const canScrollNext = computed(() => !arrivedState.right);
const canScrollPrev = computed(() => !arrivedState.left);

// Get slide element by index
const getSlideElement = (index: number): HTMLElement | null => {
  if (!sliderContainer.value) return null;
  return sliderContainer.value.children[index] as HTMLElement || null;
};

// Calculate how many slides are visible at once
const getVisibleSlidesCount = (): number => {
  if (!sliderContainer.value) return 1;
  const container = sliderContainer.value;
  const containerWidth = container.clientWidth;
  const slideWidth = container.children[0]?.clientWidth || 0;
  return Math.floor(containerWidth / slideWidth);
};

// Get current visible slide index based on scroll position
const getCurrentSlideIndex = (): number => {
  if (!sliderContainer.value) return 0;

  const container = sliderContainer.value;
  const scrollLeft = container.scrollLeft;

  // Find the slide that's most visible
  for (let i = 0; i < container.children.length; i++) {
    const slideElement = container.children[i] as HTMLElement;
    const slideLeft = slideElement.offsetLeft;
    const slideRight = slideLeft + slideElement.offsetWidth;

    if (scrollLeft >= slideLeft && scrollLeft < slideRight) {
      return i;
    }
  }

  return 0;
};

// Programmatic navigation methods using dynamic scroll position
const scrollNext = (): void => {
  if (!sliderContainer.value || !canScrollNext.value) return;

  const visibleCount = getVisibleSlidesCount();
  const currentIndex = getCurrentSlideIndex();
  const nextIndex = Math.min(currentIndex + visibleCount, sliderContainer.value.children.length - 1);

  const targetSlide = getSlideElement(nextIndex);
  if (!targetSlide) return;

  sliderContainer.value.scrollTo({
    left: targetSlide.offsetLeft,
    behavior: "smooth",
  });
};

const scrollPrev = (): void => {
  if (!sliderContainer.value || !canScrollPrev.value) return;

  const visibleCount = getVisibleSlidesCount();
  const currentIndex = getCurrentSlideIndex();
  const prevIndex = Math.max(currentIndex - visibleCount, 0);

  const targetSlide = getSlideElement(prevIndex);
  if (!targetSlide) return;

  sliderContainer.value.scrollTo({
    left: targetSlide.offsetLeft,
    behavior: "smooth",
  });
};

const SKELETON_ITEMS_TO_SHOW = 8;
const dataLoadingSkeleton = Array.from({ length: SKELETON_ITEMS_TO_SHOW }).map((_elem, index) => ({ key: String(index) })) as T;

const dataToRender = computed(() => {
  if (props.loading === undefined) {
    return props.data;
  }
  return props.data.length > 0 ? props.data : dataLoadingSkeleton;
});

// Expose methods for programmatic control
defineExpose({
  scrollNext,
  scrollPrev,
  canScrollNext,
  canScrollPrev,
});
</script>

<template>
  <div
    ref="sliderContainer"
    class="flex overflow-x-auto scroll-smooth snap-x scrollbar-hide lg:mask-edge-fade"
    :style="{
      scrollPadding: `0 1rem`,
    }"
  >
    <div
      v-for="(item, idx) in dataToRender"
      :key="item?.key ?? ''"
      class="flex-shrink-0 snap-start w-[calc(100%/3)] sm:w-[calc(100%/4)] md:w-[calc(100%/5)] lg:w-[calc(100%/6) lg:w-[calc(100%/8)] ml-4 last:mr-4"
    >
      <BaseSkeleton v-if="loading === true && data.length === 0" :loading="loading" class="h-full w-full rounded" />
      <slot
        v-else
        :item="item"
        :index="idx"
      />
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  /* Hide scrollbar for Chrome, Safari and Opera */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.scrollbar-hide::-webkit-scrollbar {
  /* Hide scrollbar for WebKit browsers */
  display: none;
}
</style>
