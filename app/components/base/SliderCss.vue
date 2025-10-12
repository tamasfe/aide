<script setup lang="ts" generic="T extends Array<{ key: string } | undefined>">
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

// Navigation state
const canScrollNext = ref(false);
const canScrollPrev = ref(false);

// Calculate how many slides are visible at once
const getVisibleSlidesCount = () => {
  if (!sliderContainer.value) return 1;
  const container = sliderContainer.value;
  const containerWidth = container.clientWidth;
  const slideWidth = container.children[0]?.clientWidth || 0;
  return Math.floor(containerWidth / slideWidth);
};

// Get slide width including gap
const getSlideWidth = () => {
  if (!sliderContainer.value || !sliderContainer.value.children[0]) return 0;
  const firstSlide = sliderContainer.value.children[0] as HTMLElement;
  const slideWidth = firstSlide.offsetWidth;
  const gap = props.gap * 16; // Convert rem to px (assuming 1rem = 16px)
  return slideWidth + gap;
};

// Programmatic navigation methods
const scrollNext = () => {
  if (!sliderContainer.value || !canScrollNext.value) return;

  const slideWidth = getSlideWidth();
  const visibleCount = getVisibleSlidesCount();
  const scrollDistance = slideWidth * visibleCount;

  sliderContainer.value.scrollBy({
    left: scrollDistance,
    behavior: "smooth",
  });
};

const scrollPrev = () => {
  if (!sliderContainer.value || !canScrollPrev.value) return;

  const slideWidth = getSlideWidth();
  const visibleCount = getVisibleSlidesCount();
  const scrollDistance = slideWidth * visibleCount;

  sliderContainer.value.scrollBy({
    left: -scrollDistance,
    behavior: "smooth",
  });
};

// Update navigation state
const updateNavigationState = () => {
  if (!sliderContainer.value) return;

  const container = sliderContainer.value;
  const { scrollLeft, scrollWidth, clientWidth } = container;

  canScrollPrev.value = scrollLeft > 0;
  canScrollNext.value = scrollLeft < scrollWidth - clientWidth - 1; // -1 for rounding tolerance
};

const SKELETON_ITEMS_TO_SHOW = 8;
const dataLoadingSkeleton = Array.from({ length: SKELETON_ITEMS_TO_SHOW }).map((_elem, index) => ({ key: String(index) })) as T;

const dataToRender = computed(() => {
  if (props.loading === undefined) {
    return props.data;
  }
  return props.data.length > 0 ? props.data : dataLoadingSkeleton;
});

const onScroll = async () => {
  if (!sliderContainer.value) return;

  // Update navigation state
  updateNavigationState();

  // Handle infinite loading
  if (loading.value) return;
  if (!canLoadMore.value) return;

  const container = sliderContainer.value;
  const { scrollLeft, scrollWidth, clientWidth } = container;

  // Calculate if we're near the end (within the threshold of slidesBeforeLoad items)
  const slideWidth = container.children[0]?.clientWidth || 0;
  const threshold = slideWidth * props.slidesBeforeLoad;
  const isNearEnd = scrollLeft + clientWidth >= scrollWidth - threshold;

  if (isNearEnd) {
    emit("trigger:load");
    await nextTick();
  }
};

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
    @scroll.passive="onScroll"
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
    <div
      v-if="canLoadMore"
      class="flex-shrink-0 snap-start w-[40%] lg:w-[100px]"
    >
      <slot name="loading" />
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
