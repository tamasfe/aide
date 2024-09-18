<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import type { CSSProperties } from "vue";
import type { EmblaOptionsType } from "embla-carousel";

const props = withDefaults(
  defineProps<{
    options?: EmblaOptionsType;
    bottomControls?: boolean;
    sideControls?: boolean;
    ratio?: CSSProperties["aspectRatio"];
  }>(),
  {
    bottomControls: true,
    sideControls: false,
  },
);

const { options } = toRefs(props);

const [emblaRef, emblaApi] = emblaCarouselVue(options.value);

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
  index === currentIndex.value ? "bg-text-emphasis" : "bg-text-subtle";

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
    :style="{
      aspectRatio: ratio,
    }"
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
        <Icon
          name="lucide:chevron-left"
          size="38"
        />
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="ghost"
        class="absolute z-[2] right-2 top-1/2 transform -translate-y-1/2 p-4 outline-none opacity-70 hover:opacity-100"
        @click="next"
      >
        <Icon
          name="lucide:chevron-right"
          size="38"
        />
      </BaseButton>
    </slot>
    <div
      v-if="bottomControls && hasMultipleSlides"
      class="absolute z-[2] left-1/2 bottom-3 transform -translate-x-1/2 flex items-center space-x-2"
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
      <div class="giro__carousel-container h-full select-none">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
