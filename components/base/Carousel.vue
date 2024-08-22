<script setup lang="ts">
import { clamp } from "@vueuse/core";

// DESIGN STATUS:       ✴️
//   * controls should disappear if a single slide
//   * most importantly... each slide should NOT be responsible for its own ratio. that should be defined in WrapperCarouselHero, so it "configures" the carousel with props or whatever. Then, adding slides very simply can be done with simple wrapping divs which automatically style with w-full/h-full, and then anything in that div can be styled with normal css (whether its an image, a button, etc)
//   * the button should be what gets the @click event... not the div wrapping it
// ARCHITECTURE STATUS: ✴️
//   * currently quite messy and should be refactored
//   * maybe: https://swiperjs.com/get-started
// TRANSLATION STATUS:  ✅

withDefaults(
  defineProps<{
    bottomControls?: boolean;
    sideControls?: boolean;
  }>(),
  {
    bottomControls: true,
    sideControls: false,
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

    const observer = new MutationObserver((list) => {
      if (!container.value) {
        return;
      }
      for (const mutation of list) {
        if (mutation.type === "childList") {
          items.value = Array.from(container.value?.children) as HTMLElement[];
        }
      }
    });

    observer.observe(container.value, {
      childList: true,
    });
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

const isFirst = computed(() => currentIndex.value === 0);
const isLast = computed(() => currentIndex.value === items.value.length - 1);

const transform = () => {
  if (container.value) {
    // check why isn't it working browser related or?
    // items.value[currentIndex.value].scrollIntoView({
    //   behavior: "smooth",
    //   block: "nearest",
    //   inline: "start",
    // });
    container.value.style.transform = `translateX(-${
      currentIndex.value
      * items.value[currentIndex.value].getBoundingClientRect().width
    }px)`;
  }
};

const bottomControlColorClass = (index: number) =>
  index === currentIndex.value ? "bg-text-emphasis" : "bg-text-subtle";

watch(currentIndex, transform);

defineExpose({
  next,
  prev,
  isFirst,
  isLast,
});
</script>

<template>
  <div class="relative">
    <slot
      v-if="sideControls"
      name="controls"
    >
      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="absolute z-[2] left-2 top-1/2 transform -translate-y-1/2 p-4 outline-none"
        @click="prev"
      >
        <Icon
          name="lucide:chevron-left"
          size="38"
        />
      </BaseButtonNew>
      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="absolute z-[2] right-2 top-1/2 transform -translate-y-1/2 p-4 outline-none"
        @click="next"
      >
        <Icon
          name="lucide:chevron-right"
          size="38"
        />
      </BaseButtonNew>
    </slot>
    <div
      v-if="bottomControls"
      class="absolute z-[2] left-1/2 bottom-0 transform -translate-x-1/2 flex items-center space-x-2"
    >
      <div
        v-for="(_, index) in items"
        :key="index"
        class="py-2 cursor-pointer giro__slide-dot-wrapper"
        @click="goto(index)"
      >
        <BaseButtonNew
          variant="ghost"
          size="ghost"
          class="w-8 md:w-12 h-1 rounded-full transition-colors duration-300 ease-in-out giro__slide-dot"
          :class="bottomControlColorClass(index)"
        />
      </div>
    </div>
    <div class="giro__carousel h-full">
      <div
        ref="container"
        class="giro__carousel-container gap-4 h-full"
      >
        <slot :index="currentIndex" />
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
