<script setup lang="ts" generic="T extends any[]">
// DESIGN STATUS:        ✴️
//   * didnt do audit of css
// ARCHITECTURE STATUS:  ✴️
//   * TODO add server side rendering support
//   * do not use 'any' anywhere in app
// TRANSLATION STATUS:   ✅

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
  },
);

const { data } = toRefs(props);

const slider = ref<HTMLElement | null>(null);

const emit = defineEmits(["click:nextPage", "click:previousPage", "scrolled"]);

const isBeginning = ref(true);
const isEnd = ref(false);
const isAnimating = ref(false);

const onScroll = () => {
  if (slider.value) {
    isBeginning.value = slider.value.scrollLeft <= 1;
    const maxWidth
      = slider.value.scrollLeft + slider.value.getBoundingClientRect().width;
    isEnd.value
      = Math.round(maxWidth) >= Math.round(slider.value.scrollWidth) - 10;
    // emit scrolled percentage to parent
    emit("scrolled", {
      scrollLeft: slider.value.scrollLeft,
      scrollWidth: slider.value.scrollWidth,
      boundingClientRect: slider.value.getBoundingClientRect(),
    });
  }
};

const nextPage = () => {
  if (isEnd.value || isAnimating.value) return;
  if (slider.value) {
    const slideWidth = slider.value.children[0]?.getBoundingClientRect().width;
    const gap = parseInt(getComputedStyle(slider.value).gap, 10);
    const value
      = slider.value.scrollLeft + (slideWidth + gap) * props.slidesToScroll;
    scrollToPosition(value, 350);
  }
  emit("click:nextPage");
};

const previousPage = () => {
  if (isBeginning.value || isAnimating.value) return;
  if (slider.value) {
    const slideWidth = slider.value.children[0]?.getBoundingClientRect().width;
    const gap = parseInt(getComputedStyle(slider.value).gap, 10);
    const value
      = slider.value.scrollLeft - (slideWidth + gap) * props.slidesToScroll;
    scrollToPosition(value, 350);
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
    }
    else {
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
          <BaseButtonNew
            variant="subtle"
            size="sm"
            class="p-1.5"
            :disabled="isBeginning"
            @click="previousPage"
          >
            <Icon
              name="lucide:chevron-left"
              size="24"
            />
          </BaseButtonNew>
          <BaseButtonNew
            variant="subtle"
            size="sm"
            class="p-1.5"
            :disabled="isEnd"
            @click="nextPage"
          >
            <Icon
              name="lucide:chevron-right"
              size="24"
            />
          </BaseButtonNew>
        </div>
      </div>
      <slot name="options" />
    </div>
    <div
      ref="slider"
      class="w-full flex items-center gap-4 overflow-auto sm:overflow-hidden giro__hide-scroll"
    >
      <slot
        v-for="(item, index) in data"
        :key="index"
        :item="item"
      />
      <slot name="loading" />
    </div>
  </div>
</template>
