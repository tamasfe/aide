<!-- TODO: Add server side rendering support -->
<script setup lang="ts" generic="T extends any[]">
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";

const props = withDefaults(
  defineProps<{
    data: T;
    showControls?: boolean;
    loading?: boolean;
    slidesToScroll?: number;
    itemClass?: string;
  }>(),
  {
    showControls: true,
    loading: false,
    slidesToScroll: 1,
  }
);

const { data } = toRefs(props);

const slider = ref<HTMLElement | null>(null);

const emit = defineEmits(["click:nextPage", "click:previousPage", "scrolled"]);

const isAtBeginning = ref(true);
const isTheEnd = ref(false);
const isAnimating = ref(false);

const onScroll = () => {
  if (slider.value) {
    isAtBeginning.value = slider.value.scrollLeft <= 1;
    const maxWidth = slider.value.scrollLeft + slider.value.clientWidth;
    isTheEnd.value =
      Math.round(maxWidth) >= Math.round(slider.value.scrollWidth) - 10;
    // emit scrolled percentage to parent
    emit("scrolled", {
      scrollLeft: slider.value.scrollLeft,
      scrollWidth: slider.value.scrollWidth,
      clientWidth: slider.value.clientWidth,
    });
  }
};

const nextPage = () => {
  if (isTheEnd.value || isAnimating.value) return;
  if (slider.value) {
    const slideWidth = slider.value.children[0]?.clientWidth;
    const gap = parseInt(getComputedStyle(slider.value).gap, 10);
    const value =
      slider.value.scrollLeft + (slideWidth + gap) * props.slidesToScroll;
    // console.log("value", value);
    // console.log("[nextPage current scrollLeft]", slider.value.scrollLeft);
    // console.log("[nextPage new scrollLeft]", slider.value.scrollLeft);
    scrollToPosition(value, 350);
    slider.value.scrollLeft = value;
  }
  emit("click:nextPage");
};

const previousPage = () => {
  if (isAtBeginning.value || isAnimating.value) return;
  if (slider.value) {
    const slideWidth = slider.value.children[0]?.clientWidth;
    const gap = parseInt(getComputedStyle(slider.value).gap, 10);
    const value =
      slider.value.scrollLeft - (slideWidth + gap) * props.slidesToScroll;
    scrollToPosition(value, 350);
    slider.value.scrollLeft = value;
  }
  emit("click:previousPage");
};

onMounted(() => {
  if (slider.value) {
    slider.value.addEventListener("scroll", onScroll);
    onScroll();
    const mutationObserver = new MutationObserver(onScroll);
    mutationObserver.observe(slider.value, { childList: true });
  }
});

onBeforeUnmount(() => {
  if (slider.value) {
    slider.value.removeEventListener("scroll", onScroll);
  }
});

// const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
//  t /= d / 2;
//  if (t < 1) return (c / 2) * t * t + b;
//  t--;
//  return (-c / 2) * (t * (t - 2) - 1) + b;
// };

const easeOutQuad = (t: number, b: number, c: number, d: number): number => {
  t /= d;
  return -c * t * (t - 2) + b;
};

const scrollToPosition = (target: number, duration: number) => {
  if (!slider.value) return;

  const start = slider.value.scrollLeft;
  const change = target - start;
  let currentTime = 0;
  const increment = 20;
  isAnimating.value = true;

  const animateScroll = () => {
    currentTime += increment;
    const val = easeOutQuad(currentTime, start, change, duration);
    if (slider.value) {
      slider.value.scrollLeft = val;
    }
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      isAnimating.value = false;
    }
  };

  animateScroll();
};
</script>

<template>
  <div class="flex flex-col gap-y-4 py-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-x-8">
        <div class="text-3xl font-bold">
          <slot name="title" />
        </div>
        <div
          v-if="showControls && !loading"
          class="flex items-center gap-x-4 text-3xl font-bold cursor-pointer"
        >
          <button
            type="button"
            class="p-1 bg-subtle text-subtle outline-none rounded-[0.4rem]"
            :class="[
              isAtBeginning
                ? 'opacity-50 cursor-default'
                : 'hover:bg-emphasis hover:text-emphasis',
            ]"
            @click="previousPage"
          >
            <PhCaretLeft :size="24" />
          </button>
          <button
            type="button"
            class="p-1 bg-subtle text-subtle outline-none rounded-[0.4rem]"
            :class="[
              isTheEnd
                ? 'opacity-50 cursor-default'
                : 'hover:bg-emphasis hover:text-emphasis',
            ]"
            @click="nextPage"
          >
            <PhCaretRight :size="24" />
          </button>
        </div>
      </div>
      <slot name="options" />
    </div>
    <div
      ref="slider"
      class="w-full flex items-center gap-4 overflow-auto sm:overflow-hidden giro__hide-scroll"
    >
      <slot v-for="(datapoint, index) in data" :key="index" :data="datapoint" />
      <slot name="loading" />
    </div>
  </div>
</template>
