<script setup lang="ts">
import { useScroll, useIntervalFn, useMouseInElement } from "@vueuse/core";

const AUTO_SLIDE_FREQUENCY_MS = 5000;

const props = withDefaults(
  defineProps<{
    slideCount: number;
    gap?: number;
    bottomControls?: boolean;
    sideControls?: boolean;
  }>(),
  {
    gap: 1,
    bottomControls: true,
    sideControls: false,
  },
);

const carouselContainer = ref<HTMLElement>();
const currentIndex = ref<number>(0);
const isUserInteracting = ref(false);
const isProgrammaticScroll = ref(false);

// Use VueUse composables for better SSR compatibility
const { x: scrollX, isScrolling } = useScroll(carouselContainer, { behavior: "smooth" });
const { pause: pauseAutoplayFn, resume: resumeAutoplayFn } = useIntervalFn(() => {
  if (!isUserInteracting.value) {
    next();
  }
}, AUTO_SLIDE_FREQUENCY_MS, { immediate: false });

const { isOutside: isMouseOutside } = useMouseInElement(carouselContainer);

// Computed properties using slideCount prop
const hasMultipleSlides = computed(() => props.slideCount > 1);
const slideIndices = computed(() => {
  return Array.from({ length: props.slideCount }, (_, index) => index);
});

// Get slide element by index
const getSlideElement = (index: number): HTMLElement | null => {
  if (!carouselContainer.value) return null;
  return carouselContainer.value.children[index] as HTMLElement || null;
};

// Calculate slide width for tracking
const getSlideWidth = (): number => {
  const firstSlide = getSlideElement(0);
  if (!firstSlide) return 0;
  return firstSlide.offsetWidth;
};

// Calculate current slide based on scroll position
const updateCurrentIndex = (): void => {
  if (!carouselContainer.value) return;

  const slideWidth = getSlideWidth();
  if (slideWidth === 0) return;

  const newIndex = Math.round(scrollX.value / slideWidth);
  currentIndex.value = Math.min(Math.max(newIndex, 0), props.slideCount - 1);
};

// Navigation methods using dynamic scroll position calculation
const goto = (index: number): void => {
  if (!carouselContainer.value) return;

  const slideElement = getSlideElement(index);
  if (!slideElement) return;

  // Mark as programmatic scroll to avoid triggering user interaction pause
  isProgrammaticScroll.value = true;

  // Calculate scroll position using element's offsetLeft
  const scrollPosition = slideElement.offsetLeft;

  carouselContainer.value.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  });

  currentIndex.value = index;

  // Reset programmatic scroll flag after a short delay
  setTimeout(() => {
    isProgrammaticScroll.value = false;
  }, 100);
};

const next = (): void => {
  const nextIndex = currentIndex.value + 1;
  if (nextIndex >= props.slideCount) {
    goto(0); // Loop back to first slide
  }
  else {
    goto(nextIndex);
  }
};

const prev = (): void => {
  const prevIndex = currentIndex.value - 1;
  if (prevIndex < 0) {
    goto(props.slideCount - 1); // Loop to last slide
  }
  else {
    goto(prevIndex);
  }
};

// Autoplay control functions
const pauseAutoplay = (): void => {
  isUserInteracting.value = true;
  pauseAutoplayFn();
};

const resumeAutoplay = (): void => {
  isUserInteracting.value = false;
  if (hasMultipleSlides.value) {
    resumeAutoplayFn();
  }
};

const bottomControlColorClass = (index: number) =>
  index === currentIndex.value ? "opacity-70 bg-white" : "opacity-30 bg-white";

// Watch for scroll changes to update current index
watch(scrollX, () => {
  updateCurrentIndex();
});

// Watch for user scrolling to pause autoplay
watch(isScrolling, (scrolling) => {
  if (scrolling && !isProgrammaticScroll.value) {
    // User is manually scrolling, pause autoplay
    pauseAutoplay();
  }
});

// Watch mouse enter/leave for autoplay control
watch(isMouseOutside, (outside) => {
  if (outside) {
    resumeAutoplay();
  }
  else {
    pauseAutoplay();
  }
});

// Initialize on mount (SSR-safe)
onMounted(() => {
  updateCurrentIndex();
  if (hasMultipleSlides.value) {
    resumeAutoplayFn();
  }
});

defineExpose({
  next,
  prev,
});
</script>

<template>
  <div class="relative">
    <div class="hidden lg:block">
      <BaseButton
        variant="ghost"
        size="ghost"
        class="absolute z-[2] left-2 top-1/2 transform -translate-y-1/2 p-4 outline-none opacity-70 hover:opacity-100"
        @click="prev"
      >
        <BaseIcon
          name="lucide:chevron-left"
          :size="38"
        />
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="ghost"
        class="absolute z-[2] right-2 top-1/2 transform -translate-y-1/2 p-4 outline-none opacity-70 hover:opacity-100"
        @click="next"
      >
        <BaseIcon
          name="lucide:chevron-right"
          :size="38"
        />
      </BaseButton>
    </div>
    <div
      class="flex pointer-events-none absolute z-[2] left-1/2 bottom-3 transform -translate-x-1/2 items-center space-x-2"
    >
      <div
        v-for="(_, index) in slideIndices"
        :key="index"
        class="py-2 cursor-pointer giro__slide-dot-wrapper"
      >
        <BaseButton
          variant="ghost"
          size="ghost"
          class="w-8 md:w-12 h-1 rounded-full transition-colors duration-300 ease-in-out giro__slide-dot"
          :class="bottomControlColorClass(index)"
        />
      </div>
    </div>
    <div
      ref="carouselContainer"
      class="
        flex
        overflow-x-auto
        scroll-smooth
        snap-x
        scrollbar-hide
        snap-mandatory
        md:mask-edge-fade
        px-4
        [--gap:0.5rem]
        md:[--gap:1rem]
        gap-[var(--gap)]
        [--cols:1]
        sm:[--cols:2]
        md:[--cols:3]"
      :style="{
        scrollPadding: `0 1rem`,
      }"
    >
      <slot />
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

.giro__slide-dot-wrapper:hover .giro__slide-dot {
  transition: transform 150ms;
  transform: translateY(-50%);
}
</style>
