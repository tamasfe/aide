<script setup lang="ts" generic="T extends Array<{ key: string } | undefined>">
import emblaCarouselVue from "embla-carousel-vue";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";

export type SliderBreakpoints = "sm" | "md" | "lg" | "xl";
export type SliderBreakpointValues = Record<SliderBreakpoints, number>;
export type Plugin = ReturnType<typeof WheelGesturesPlugin>;

const emit = defineEmits<{
  (e: "trigger:load"): void;
}>();

const props = withDefaults(
  defineProps<{
    slides: SliderBreakpointValues;
    gap: number;
    data: T;
    manualScroll?: boolean;
    slidesBeforeLoad?: number;
    canLoadMore?: boolean;
    options?: EmblaOptionsType;
    loading?: boolean;
  }>(),
  {
    loading: false,
    canLoadMore: false,
    slidesBeforeLoad: 1,
    manualScroll: false,
  },
);

const { options, canLoadMore, loading } = toRefs(props);

const canScrollPrev = ref(false);
const canScrollNext = ref(false);

const canScrollBackward = (emblaApi: EmblaCarouselType) => {
  const { target, limit } = emblaApi.internalEngine();
  const targetRounded = parseFloat(target.get().toFixed(2));
  return targetRounded < limit.max;
};

const canScrollForward = (emblaApi: EmblaCarouselType) => {
  const { target, limit } = emblaApi.internalEngine();
  const targetRounded = parseFloat(target.get().toFixed(2));
  return targetRounded > limit.min;
};

const initPlugins = () => {
  const plugins: Plugin[] = [];
  if (props.manualScroll) {
    plugins.push(WheelGesturesPlugin());
  }
  return plugins;
};

const [emblaRef, emblaApi] = emblaCarouselVue(
  {
    watchSlides: (emblaApi) => {
      const reloadEmbla = (): void => {
        const oldEngine = emblaApi.internalEngine();

        emblaApi.reInit();
        const newEngine = emblaApi.internalEngine();
        const copyEngineModules: (keyof typeof newEngine)[] = [
          "scrollBody",
          "location",
          "offsetLocation",
          "previousLocation",
          "target",
        ];
        copyEngineModules.forEach((engineModule) => {
          Object.assign(newEngine[engineModule], oldEngine[engineModule]);
        });

        newEngine.translate.to(oldEngine.location.get());
        const { index } = newEngine.scrollTarget.byDistance(0, false);
        newEngine.index.set(index);
        newEngine.animation.start();

        canScrollPrev.value = canScrollBackward(emblaApi);
        canScrollNext.value = canScrollForward(emblaApi);
      };

      const reloadAfterPointerUp = (): void => {
        emblaApi.off("pointerUp", reloadAfterPointerUp);
        reloadEmbla();
      };

      const engine = emblaApi.internalEngine();

      if (canLoadMore.value && engine.dragHandler.pointerDown()) {
        const boundsActive = engine.limit.reachedMax(engine.target.get());
        engine.scrollBounds.toggleActive(boundsActive);
        emblaApi.on("pointerUp", reloadAfterPointerUp);
      }
      else {
        reloadEmbla();
      }
    },
    skipSnaps: false,
    ...options.value,
  },
  initPlugins(),
);

const onScroll = async () => {
  if (!emblaApi.value) return;
  if (loading.value) return;
  if (!canLoadMore.value) return;

  const slideIndex
    = emblaApi.value.slideNodes().length - props.slidesBeforeLoad;
  const slideInView = emblaApi.value.slidesInView().includes(slideIndex);

  if (slideInView) {
    emit("trigger:load");
    await nextTick();
  }
};

const setupInfiniteScroll = () => {
  if (emblaApi.value && canLoadMore.value) {
    emblaApi.value.on("scroll", onScroll);
  }
};

const getScrollMetadata = (emblaApi: EmblaCarouselType) => {
  canScrollNext.value = canScrollForward(emblaApi);
  canScrollPrev.value = canScrollBackward(emblaApi);
};

onMounted(() => {
  setupInfiniteScroll();
  emblaApi.value
    ?.on("init", getScrollMetadata)
    .on("reInit", getScrollMetadata)
    .on("select", getScrollMetadata);
});

onBeforeUnmount(() => {
  emblaApi.value?.off("scroll", onScroll);
  emblaApi.value?.off("init", getScrollMetadata);
  emblaApi.value?.off("reInit", getScrollMetadata);
  emblaApi.value?.off("select", getScrollMetadata);
  emblaApi.value?.destroy();
});

const slideSizes = computed(() => {
  const { slides, gap } = props;
  return Object.keys(slides).reduce(
    (sizes, key) => {
      const column = slides[key as keyof SliderBreakpointValues];
      const numberOfGaps = Math.ceil(column) - 1;
      sizes[key as keyof SliderBreakpointValues]
        = `calc((100% - ${numberOfGaps * gap}rem)/${column})`;
      return sizes;
    },
    {} as Record<keyof SliderBreakpointValues, string>,
  );
});

defineExpose({
  emblaApi,
  canScrollNext,
  canScrollPrev,
});

const SKELETON_ITEMS_TO_SHOW = 8;
const dataLoadingSkeleton = Array.from({ length: SKELETON_ITEMS_TO_SHOW }).map((_elem, index) => ({ key: String(index) })) as T;

const dataToRender = computed(() => {
  if (props.loading === undefined) {
    return props.data;
  }
  return props.data.length > 0 ? props.data : dataLoadingSkeleton;
});
</script>

<template>
  <div
    ref="emblaRef"
    class="giro__slider"
  >
    <div
      class="giro__slider-container w-full select-none"
      :style="{ gap: `${gap}rem` }"
    >
      <div
        v-for="(item, idx) in dataToRender"
        :key="item?.key ?? ''"
        class="giro__slider-slide"
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
        class="giro__slider-slide"
      >
        <slot name="loading" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.giro__slider {
  overflow: hidden;
}
.giro__slider-container {
  display: flex;
}
.giro__slider-slide {
  transform: translate3d(0, 0, 0);
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: v-bind("slideSizes.sm");
  min-width: 0;
}

@media (min-width: 640px) {
  .giro__slider-slide {
    flex-basis: v-bind("slideSizes.md");
  }
}

@media (min-width: 768px) {
  .giro__slider-slide {
    flex-basis: v-bind("slideSizes.lg");
  }
}

@media (min-width: 1024px) {
  .giro__slider-slide {
    flex-basis: v-bind("slideSizes.xl");
  }
}
</style>
