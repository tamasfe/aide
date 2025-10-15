<script setup lang="ts" generic="T extends Array<{ key: string } | undefined>">
import { useScroll, useInfiniteScroll } from "@vueuse/core";

const emit = defineEmits<{
  (e: "trigger:load"): void;
}>();

const props = withDefaults(
  defineProps<{
    data: T;
    canLoadMore?: boolean;
    slidesBeforeLoad?: number;
  }>(),
  {
    canLoadMore: false,
    slidesBeforeLoad: 1,
  },
);

const { canLoadMore } = toRefs(props);
const sliderContainer = ref<HTMLElement>();

// Use VueUse for scroll tracking
const { arrivedState } = useScroll(sliderContainer, { behavior: "smooth" });

// Use VueUse infinite scroll for loading additional elements
useInfiniteScroll(
  sliderContainer,
  () => {
    emit("trigger:load");
  },
  {
    direction: "right",
    distance: 128,
    canLoadMore: () => canLoadMore.value,
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

const dataToRender = computed(() => {
  return props.data;
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
    class="
      flex
      overflow-x-auto
      scroll-smooth
      snap-x
      scroll-px-4
      scrollbar-hide
      snap-mandatory
      md:mask-edge-fade
      px-4
      [--gap:0.5rem]
      md:[--gap:1rem]
      gap-[var(--gap)]
      [--cols:3]
      sm:[--cols:5]
      md:[--cols:7]
      lg:[--cols:8]"
  >
    <div
      v-for="(item, idx) in dataToRender"
      :key="item?.key ?? ''"
      class="flex-shrink-0 snap-start w-[calc((100%-(var(--gap)*(var(--cols)-1)))/var(--cols))]"
    >
      <slot
        :item="item"
        :index="idx"
      />
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
