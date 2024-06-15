<script setup lang="ts">
import { clamp } from "@vueuse/core";
import { ref, onMounted } from "vue";

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

watch(currentIndex, transform);

defineExpose({
  next,
  prev,
});
</script>

<template>
  <div class="relative">
    <div class="giro__carousel">
      <div
        ref="container"
        class="giro__carousel-container gap-4"
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
</style>
