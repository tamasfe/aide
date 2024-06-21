<script setup lang="ts">
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";
import { clamp } from "@vueuse/core";

withDefaults(
  defineProps<{
    bottomControls?: boolean;
    sideControls?: boolean;
    bottomControlsClass?: string;
  }>(),
  {
    bottomControls: false,
    sideControls: false,
    bottomControlsClass: undefined,
  },
);

const container = ref<HTMLElement | null>(null);
const items = ref<HTMLElement[]>([]);
const currentIndex = ref(0);

const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0];
  const x = touch.clientX;

  const handleTouchEnd = () => {
    container.value?.removeEventListener("touchmove", handleTouchMove);
    container.value?.removeEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    const dx = touch.clientX - x;
    if (dx > 100) {
      prev();
      handleTouchEnd();
    }
    else if (dx < -100) {
      next();
      handleTouchEnd();
    }
  };

  container.value?.addEventListener("touchmove", handleTouchMove);
  container.value?.addEventListener("touchend", handleTouchEnd);
};

onMounted(() => {
  if (container.value) {
    items.value = Array.from(container.value.children) as HTMLElement[];
    container.value.addEventListener("touchstart", handleTouchStart);
  }
});

const goto = (index: number) => {
  currentIndex.value = clamp(index, 0, items.value.length - 1);
};

const next = () => {
  goto(currentIndex.value + 1);
};

const prev = () => {
  goto(currentIndex.value - 1);
};

const transform = () => {
  if (container.value) {
    // check why isn't it working browser related or?
    // items.value[currentIndex.value].scrollIntoView({
    //   behavior: "smooth",
    //   block: "nearest",
    //   inline: "start",
    // });
    container.value.style.transform = `translateX(-${
      currentIndex.value * items.value[currentIndex.value].clientWidth
    }px)`;
  }
};

const bottomControlColorClass = (index: number) =>
  index === currentIndex.value ? "bg-text-emphasis" : "bg-text-subtle";

watch(currentIndex, transform);

defineExpose({
  next,
  prev,
});
</script>

<template>
  <div class="relative">
    <slot
      v-if="sideControls"
      name="controls"
    >
      <button
        type="button"
        class="absolute z-[2] left-8 top-1/2 transform -translate-y-1/2 p-1 bg-subtle hover:bg-emphasis rounded-default outline-none text-subtle"
        @click="prev"
      >
        <PhCaretLeft :size="24" />
      </button>
      <button
        type="button"
        class="absolute z-[2] right-8 top-1/2 transform -translate-y-1/2 p-1 bg-subtle hover:bg-emphasis rounded-default outline-none text-subtle"
        @click="next"
      >
        <PhCaretRight :size="24" />
      </button>
    </slot>
    <div
      v-if="bottomControls"
      class="absolute z-[2] left-1/2 bottom-0 transform -translate-x-1/2 flex items-center space-x-2"
      :class="bottomControlsClass"
    >
      <div
        v-for="(_, index) in items"
        :key="index"
        class="py-2 cursor-pointer giro__slide-dot-wrapper"
        @click="goto(index)"
      >
        <button
          class="w-8 md:w-12 h-1 rounded-full transition-colors duration-300 ease-in-out giro__slide-dot"
          :class="bottomControlColorClass(index)"
          type="button"
        />
      </div>
    </div>
    <div class="giro__carousel h-full">
      <div
        ref="container"
        class="giro__carousel-container gap-4 h-full"
      >
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
  transition: transform 0.5s;
}

:deep(.giro__carousel-container > *) {
  flex: 0 0 100%;
}

.giro__slide-dot-wrapper:hover .giro__slide-dot {
  transition: transform 150ms;
  transform: translateY(-50%);
}
</style>
