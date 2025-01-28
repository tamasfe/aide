<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import Autoplay from "embla-carousel-autoplay";
import type { CSSProperties } from "vue";
import type { EmblaOptionsType } from "embla-carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

const AUTO_SLIDE_FREQUENCY_MS = 5000;

type SliderBreakpoints = "sm" | "md" | "lg" | "xl";
type SliderBreakpointValues = Record<SliderBreakpoints, number>;

const props = withDefaults(
  defineProps<{
    slides?: SliderBreakpointValues;
    gap?: number;
    options?: EmblaOptionsType;
    bottomControls?: boolean;
    sideControls?: boolean;
    slideRatio?: CSSProperties["aspectRatio"];
  }>(),
  {
    slides: () => ({
      sm: 1.1,
      md: 2,
      lg: 2,
      xl: 3,
    }),
    gap: 1,
    bottomControls: true,
    sideControls: false,
  },
);

const { options } = toRefs(props);

const [emblaRef, emblaApi] = emblaCarouselVue({
  skipSnaps: true,
  ...options.value,
}, [
  Autoplay({ delay: AUTO_SLIDE_FREQUENCY_MS, stopOnInteraction: false, stopOnFocusIn: true, stopOnMouseEnter: true }),
  WheelGesturesPlugin(),
]);

const items = ref<number[]>([]);
const hasMultipleSlides = ref(false);
const currentIndex = ref<number>(0);

const goto = (index: number) => {
  emblaApi.value?.scrollTo(index);
};

const next = () => {
  emblaApi.value?.scrollNext();
};

const prev = () => {
  emblaApi.value?.scrollPrev();
};

const bottomControlColorClass = (index: number) =>
  index === currentIndex.value ? "opacity-70 bg-white" : "opacity-30 bg-white";

const getCarouselMetadata = () => {
  const index = emblaApi.value?.selectedScrollSnap();
  if (index !== undefined) {
    currentIndex.value = index;
  }

  const slides = emblaApi.value?.scrollSnapList();
  if (slides) {
    hasMultipleSlides.value = slides.length > 1;
    items.value = slides;
  }
};

const slideSizes = computed(() => {
  return Object.keys(props.slides).reduce(
    (sizes, key) => {
      const column = props.slides[key as keyof SliderBreakpointValues];
      const numberOfGaps = Math.ceil(column) - 1;
      sizes[key as keyof SliderBreakpointValues]
        = `calc((100% - ${numberOfGaps * props.gap}rem)/${column})`;
      return sizes;
    },
    {} as Record<keyof SliderBreakpointValues, string>,
  );
});

onMounted(() => {
  emblaApi.value
    ?.on("init", getCarouselMetadata)
    ?.on("reInit", getCarouselMetadata)
    ?.on("select", getCarouselMetadata);
});

onBeforeUnmount(() => {
  emblaApi.value?.off("init", getCarouselMetadata);
  emblaApi.value?.off("reInit", getCarouselMetadata);
  emblaApi.value?.off("select", getCarouselMetadata);
  emblaApi.value?.destroy();
});

defineExpose({
  next,
  prev,
});
</script>

<template>
  <div
    class="relative"
  >
    <slot
      v-if="sideControls && hasMultipleSlides"
      name="controls"
    >
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
    </slot>
    <div
      v-if="bottomControls && hasMultipleSlides"
      class="pointer-events-none md:pointer-events-auto absolute z-[2] left-1/2 bottom-3 transform -translate-x-1/2 flex items-center space-x-2"
    >
      <div
        v-for="(_, index) in items"
        :key="index"
        class="py-2 cursor-pointer giro__slide-dot-wrapper"
        @click="goto(index)"
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
      ref="emblaRef"
      class="giro__carousel h-full"
    >
      <div
        class="giro__carousel-container h-full select-none"
        :style="{ gap: `${gap}rem` }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.giro__carousel {
  overflow: hidden;
}

.giro__carousel-container {
  display: flex;
}

:deep(.giro__carousel-container > *) {
  flex: 0 0 100%;
}

.giro__slide-dot-wrapper:hover .giro__slide-dot {
  transition: transform 150ms;
  transform: translateY(-50%);
}

.giro__carousel-container > * {
  aspect-ratio: v-bind("slideRatio");
  transform: translate3d(0, 0, 0);
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: v-bind("slideSizes.sm");
  min-width: 0;

}

@media (min-width: 640px) {
  .giro__carousel-container > * {
    flex-basis: v-bind("slideSizes.md");
  }
}

@media (min-width: 768px) {
  .giro__carousel-container > * {
    flex-basis: v-bind("slideSizes.lg");
  }
}

@media (min-width: 1024px) {
  .giro__carousel-container > * {
    flex-basis: v-bind("slideSizes.xl");
  }
}
</style>
